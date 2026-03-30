import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import OpenAI from 'openai';
import * as FileSystem from 'expo-file-system';

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
  }, [permission]);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync({ base64: true });
      setPhoto(photoData);
      analyzeImage(photoData.base64);
    }
  };

  const analyzeImage = async (base64Image) => {
    if (!apiKey) {
      Alert.alert('Error', 'Please enter your OpenAI API key');
      return;
    }
    setLoading(true);
    try {
      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // or gpt-4-vision-preview if available
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Describe this painting, identify the author if possible, and provide some interesting information about the artwork.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 500
      });
      setResult(response.choices[0].message.content);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image: ' + error.message);
    }
    setLoading(false);
  };

  const speakResult = () => {
    if (result) {
      Speech.speak(result);
    }
  };

  if (!permission) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return <View style={styles.container}><Text>Camera permission denied</Text></View>;
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
              <TouchableOpacity style={styles.button} onPress={() => { setPhoto(null); setResult(''); }}>
                <Text style={styles.buttonText}>Scan Another</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
