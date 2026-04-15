import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f0e6d3',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 15,
    color: '#c4b89a',
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 30,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f0e6d3',
    letterSpacing: 1,
  },
  captureBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
  },
  captureButton: {
    backgroundColor: '#c9a96e',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 180,
    alignItems: 'center',
  },
  captureButtonText: {
    color: '#1a1a2e',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  resultContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  resultCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#c9a96e',
  },
  resultText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#e0d6c2',
  },
  actionBar: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 130,
  },
  speakButton: {
    backgroundColor: '#c9a96e',
  },
  scanAgainButton: {
    backgroundColor: '#334155',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#334155',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#e0d6c2',
    borderRadius: 8,
  },
});

export default styles;
