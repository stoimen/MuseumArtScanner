import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import OpenAI from 'openai';
import styles from './styles';
import { ARTWORK_ANALYSIS_PROMPT } from './prompts';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [apiKey, setApiKey] = useState('');
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const analyzeImage = async (base64Image: string) => {
    if (!apiKey) {
      Alert.alert('Error', 'Please enter your OpenAI API key');
      return;
    }

    setLoading(true);

    try {
      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: ARTWORK_ANALYSIS_PROMPT },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
            ],
          },
        ],
        max_tokens: 500,
      });

      setResult(response.choices[0]?.message?.content ?? 'No analysis was returned.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to analyze image: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) {
      return;
    }

    const photoData = await cameraRef.current.takePictureAsync({ base64: true });
    setPhoto(photoData);

    if (photoData.base64) {
      await analyzeImage(photoData.base64);
    } else {
      Alert.alert('Error', 'Photo was captured without image data. Please try again.');
    }
  };

  const speakResult = () => {
    if (result) {
      Speech.speak(result);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera permission denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter OpenAI API Key"
        value={apiKey}
        onChangeText={setApiKey}
        secureTextEntry
      />
      {!photo ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={cameraRef} />
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Image source={{ uri: photo.uri }} style={styles.image} />
          {loading ? (
            <Text>Analyzing...</Text>
          ) : (
            <>
              <Text style={styles.resultText}>{result}</Text>
              <TouchableOpacity style={styles.button} onPress={speakResult}>
                <Text style={styles.buttonText}>Read Aloud</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setPhoto(null);
                  setResult('');
                }}
              >
                <Text style={styles.buttonText}>Scan Another</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}
