# MuseumArtScanner

A React Native app built with Expo that lets you scan paintings in museums using your camera. The app uses a pluggable AI provider layer (OpenAI or Gemini) to identify the artist and provide information about the artwork, and it can read the results aloud.

## Features

- **Camera scan**: Take photos of paintings with the built-in camera.
- **AI analysis**: Send the image to the configured AI provider to get details about the artist and the artwork.
- **Read aloud**: Listen to the information via text-to-speech while walking through the museum.
- **Pluggable providers**: Switch between OpenAI and Gemini with environment variables.
- **Simple setup**: Configure your AI provider and start scanning.

## Prerequisites

- Node.js (version 18 or newer)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For OpenAI: an API key (get one from [OpenAI Platform](https://platform.openai.com/))
- For Gemini: a Google AI Studio API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))
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

3. Install additional Expo packages (if not already installed):
   ```
   npx expo install expo-camera expo-speech openai expo-file-system
   ```

4. Configure your AI provider. Expo only bundles environment variables that
   start with `EXPO_PUBLIC_`, so all keys must use that prefix.

   **OpenAI**
   ```
   export EXPO_PUBLIC_AI_PROVIDER="openai"
   export EXPO_PUBLIC_OPENAI_API_KEY="sk-..."
   ```

   **Gemini**
   ```
   export EXPO_PUBLIC_AI_PROVIDER="gemini"
   export EXPO_PUBLIC_GEMINI_API_KEY="AIza..."
   ```

## OpenAI API setup and credentials

If you want to use OpenAI, follow these steps:

1. Go to the [OpenAI Platform](https://platform.openai.com/) and sign in (or create an account).
2. Open the API keys page: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).
3. Click **Create new secret key** and name it for this app/environment.
4. Copy the key right away (you will not be able to see the full key again later).
5. Store it in your shell environment (Expo requires the `EXPO_PUBLIC_` prefix):
   ```
   export EXPO_PUBLIC_AI_PROVIDER="openai"
   export EXPO_PUBLIC_OPENAI_API_KEY="sk-..."
   ```
6. Start Expo from the same terminal session so the app can read the environment variables:
   ```
   npm start
   ```

## Gemini API setup and credentials

If you want to use Gemini, follow these steps:

1. Go to [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
2. Open the API keys page: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
3. Click **Create API key**.
4. Copy the generated key and store it in your shell environment (Expo requires the `EXPO_PUBLIC_` prefix):
   ```
   export EXPO_PUBLIC_AI_PROVIDER="gemini"
   export EXPO_PUBLIC_GEMINI_API_KEY="AIza..."
   ```
5. Start Expo from the same terminal session so the app can read the environment variables:
   ```
   npm start
   ```

### Credential safety tips

- Do not commit keys to Git.
- Rotate keys if they are exposed.
- Use separate keys for development and production when possible.
- Consider using EAS secrets or your CI/CD secret manager for build pipelines.

## Running the app

1. Start the Expo development server:
   ```
   npm start
   ```

2. Open the app on your device:
   - **iOS**: Install the Expo Go app from the App Store. Scan the QR code shown in the terminal.
   - **Android**: Install Expo Go from the Google Play Store. Scan the QR code.

3. Test the functionality: take a photo and run the analysis.

## Testing

- **Development**: Use Expo Go for quick testing on your device.
- **Simulator/Emulator**:
  - iOS: `npm run ios` (requires macOS and Xcode)
  - Android: `npm run android` (requires Android Studio)
- **Type checks**: Run `npm run typecheck`.
- **Manual testing**: Test camera permissions, API calls, and text-to-speech on different devices.

## Installation on iPhone

### Apple Developer account (for production testing)

If you want to install a production iOS build on physical devices (outside Expo Go), you typically need an Apple Developer Program membership.

1. Go to [developer.apple.com/programs](https://developer.apple.com/programs/).
2. Sign in with your Apple ID (or create one).
3. Enroll in the Apple Developer Program (usually **$99/year** in the U.S.; pricing can vary by region).
4. After enrollment is approved, use the same Apple account in Expo/EAS when prompted during iOS build credential setup.

Without paid enrollment, you can still use Expo Go for development testing, but App Store/TestFlight distribution and broader device provisioning require the Developer Program.

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

- **API keys** (all must use the `EXPO_PUBLIC_` prefix so Expo bundles them):
  - Claude uses `EXPO_PUBLIC_ANTHROPIC_API_KEY`
  - OpenAI uses `EXPO_PUBLIC_OPENAI_API_KEY`
  - Gemini uses `EXPO_PUBLIC_GEMINI_API_KEY`
- **Provider selection**: Set `EXPO_PUBLIC_AI_PROVIDER` to `claude`, `openai`, or `gemini`.
- **Gemini allowance**: The Gemini client automatically falls back from
  `gemini-2.5-flash-lite` → `gemini-2.5-flash` → `gemini-2.5-pro` when the
  free-tier quota is exhausted, so scans keep working even after hitting limits.
- **Costs**: AI provider API calls cost money—monitor your usage and billing.
- **Permissions**: Make sure camera permissions are granted in your device settings.
- **Troubleshooting**: If something fails, check the Expo documentation or the terminal logs.
- **Customization**: You can add new AI providers by implementing the shared interface in `src/ai/` and wiring them in the provider factory.

## License

This project is licensed under the MIT License.
