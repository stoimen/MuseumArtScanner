# MuseumArtScanner

A React Native app built with Expo that lets you scan paintings in museums using your camera. The app uses ChatGPT (OpenAI) to identify the artist and provide information about the artwork, and it can read the results aloud.

## Features

- **Camera scan**: Take photos of paintings with the built-in camera.
- **AI analysis**: Send the image to OpenAI to get details about the artist and the artwork.
- **Read aloud**: Listen to the information via text-to-speech while walking through the museum.
- **Easy to use**: Enter your OpenAI API key and start scanning.

## Prerequisites

- Node.js (version 18 or newer)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- An OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/))
- For iOS: macOS with Xcode (for local builds) or EAS CLI for cloud builds
- For Android: Android Studio or EAS CLI

## Installation

1. Clone the repository or navigate to the project directory:
   ```
   cd /path/to/MuseumArtScanner
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install additional packages (if not already installed):
   ```
   npx expo install expo-camera expo-speech openai expo-file-system
   ```

## Running the app

1. Start the Expo development server:
   ```
   npm start
   ```

2. Open the app on your device:
   - **iOS**: Install the Expo Go app from the App Store. Scan the QR code shown in the terminal.
   - **Android**: Install Expo Go from the Google Play Store. Scan the QR code.

3. Enter your OpenAI API key in the app.

4. Test the functionality: take a photo and run the analysis.

## Testing

- **Development**: Use Expo Go for quick testing on your device.
- **Simulator/Emulator**:
  - iOS: `npm run ios` (requires macOS and Xcode)
  - Android: `npm run android` (requires Android Studio)
- **Unit tests**: Add tests with Jest (Expo supports Jest by default). Run `npm test`.
- **Manual testing**: Test camera permissions, API calls, and text-to-speech on different devices.

## Installation on iPhone

### Option 1: Expo Go (recommended for testing)
1. Install Expo Go on your iPhone.
2. Run `npm start` and scan the QR code.

### Option 2: Native build with EAS (for production)
1. Install EAS CLI:
   ```
   npm install -g eas-cli
   ```

2. Log in to Expo:
   ```
   eas login
   ```

3. Build the iOS app:
   ```
   eas build --platform ios
   ```

4. Download the IPA file and install it on your iPhone (requires an Apple Developer account for distribution).

## Installation on Android

### Option 1: Expo Go (recommended for testing)
1. Install Expo Go on your Android device.
2. Run `npm start` and scan the QR code.

### Option 2: Native build with EAS (for production)
1. Install EAS CLI (if not already installed).
2. Log in to Expo (if not already done).
3. Build the Android app:
   ```
   eas build --platform android
   ```

4. Download the APK file and install it on your Android device.

## Notes

- **API key**: Store your OpenAI API key securely. The app uses it for API calls.
- **Costs**: OpenAI API calls cost money—monitor your usage and billing.
- **Permissions**: Make sure camera permissions are granted in your device settings.
- **Troubleshooting**: If something fails, check the Expo documentation or the terminal logs.
- **Customization**: The code is in `App.js`. You can extend it, for example with offline modes or additional languages.

## License

This project is licensed under the MIT License.
