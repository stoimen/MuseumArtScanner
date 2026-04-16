import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { readAsStringAsync } from 'expo-file-system';
import styles from './styles';
import { ARTWORK_ANALYSIS_PROMPT } from './prompts';
import { getVisionClient } from './src/ai/clientFactory';

type PhotoData = {
  uri: string;
  base64?: string;
};

type AnalysisPhase = 'idle' | 'capturing' | 'compressing' | 'analyzing';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const [result, setResult] = useState('');
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Track speech state
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const readImageAsBase64 = async (uri: string): Promise<string> => {
    const base64 = await readAsStringAsync(uri, { encoding: 'base64' });
    return base64;
  };

  const analyzeImage = useCallback(async (base64Image: string) => {
    setPhase('analyzing');
    try {
      const visionClient = getVisionClient();
      const analysis = await visionClient.analyzeArtwork({
        base64Image,
        prompt: ARTWORK_ANALYSIS_PROMPT,
      });
      setResult(analysis);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Analysis Failed', `Could not analyze the image: ${message}`);
    } finally {
      setPhase('idle');
    }
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    setPhase('capturing');
    try {
      const photoData = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 0.7,
      });

      if (!photoData || !photoData.uri) {
        Alert.alert('Capture Failed', 'The camera did not return an image. Please try again.');
        setPhase('idle');
        return;
      }

      setPhoto({ uri: photoData.uri });
      setPhase('compressing');

      const base64 = await readImageAsBase64(photoData.uri);
      await analyzeImage(base64);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Capture Error', `Failed to take photo: ${message}`);
      setPhase('idle');
    }
  };

  const speakResult = async () => {
    if (!result) return;

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(result, {
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const resetScan = () => {
    Speech.stop();
    setIsSpeaking(false);
    setPhoto(null);
    setResult('');
    setPhase('idle');
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Camera Access Required</Text>
        <Text style={styles.statusText}>
          This app needs camera access to scan artwork.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!photo ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={cameraRef} />
          <View style={styles.cameraOverlay}>
            <Text style={styles.overlayTitle}>Museum Art Scanner</Text>
          </View>
          <View style={styles.captureBar}>
            <TouchableOpacity
              style={[styles.captureButton, phase !== 'idle' && styles.buttonDisabled]}
              onPress={takePhoto}
              disabled={phase !== 'idle'}
            >
              {phase !== 'idle' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.captureButtonText}>Scan Artwork</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.resultContainer}
        >
          <Image source={{ uri: photo.uri }} style={styles.image} />

          {phase !== 'idle' ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.statusText}>
                {phase === 'capturing'
                  ? 'Capturing image...'
                  : phase === 'compressing'
                    ? 'Preparing image...'
                    : 'Analyzing artwork...'}
              </Text>
            </View>
          ) : (
            <>
              {result ? (
                <View style={styles.resultCard}>
                  <Text style={styles.resultText}>{result}</Text>
                </View>
              ) : null}

              <View style={styles.actionBar}>
                {result ? (
                  <TouchableOpacity
                    style={[styles.button, styles.speakButton]}
                    onPress={speakResult}
                  >
                    <Text style={styles.buttonText}>
                      {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={[styles.button, styles.scanAgainButton]}
                  onPress={resetScan}
                >
                  <Text style={styles.buttonText}>Scan Another</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
