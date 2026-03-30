# MuseumArtScanner

Eine React Native-App mit Expo, die es Ihnen ermöglicht, Gemälde in Museen mit der Kamera zu scannen. Die App verwendet ChatGPT (OpenAI), um den Autor und Informationen über das Kunstwerk zu identifizieren, und kann die Ergebnisse vorlesen lassen.

## Funktionen

- **Kamera-Scan**: Fotografieren Sie Gemälde mit der integrierten Kamera.
- **KI-Analyse**: Senden Sie das Bild an OpenAI, um Details über den Autor und das Kunstwerk zu erhalten.
- **Vorlesen**: Hören Sie die Informationen per Text-to-Speech an, während Sie durch das Museum gehen.
- **Einfach zu bedienen**: Geben Sie Ihren OpenAI-API-Schlüssel ein und starten Sie den Scan.

## Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn
- Expo CLI (`npm install -g @expo/cli`)
- Ein OpenAI-API-Schlüssel (erhalten Sie ihn von [OpenAI Platform](https://platform.openai.com/))
- Für iOS: macOS mit Xcode (für lokale Builds) oder EAS CLI für Cloud-Builds
- Für Android: Android Studio oder EAS CLI

## Installation

1. Klonen oder navigieren Sie zum Projektverzeichnis:
   ```
   cd /path/to/MuseumArtScanner
   ```

2. Installieren Sie die Abhängigkeiten:
   ```
   npm install
   ```

3. Installieren Sie zusätzliche Pakete (falls nicht bereits geschehen):
   ```
   npx expo install expo-camera expo-speech openai expo-file-system
   ```

## Ausführen der App

1. Starten Sie den Expo-Entwicklungsserver:
   ```
   npm start
   ```

2. Öffnen Sie die App auf Ihrem Gerät:
   - **iOS**: Installieren Sie die Expo Go-App aus dem App Store. Scannen Sie den QR-Code im Terminal.
   - **Android**: Installieren Sie Expo Go aus dem Google Play Store. Scannen Sie den QR-Code.

3. Geben Sie Ihren OpenAI-API-Schlüssel in der App ein.

4. Testen Sie die Funktionen: Nehmen Sie ein Foto auf und lassen Sie die Analyse durchführen.

## Testen

- **Entwicklung**: Verwenden Sie Expo Go für schnelle Tests auf Ihrem Gerät.
- **Simulator/Emulator**:
  - iOS: `npm run ios` (erfordert macOS und Xcode)
  - Android: `npm run android` (erfordert Android Studio)
- **Unit-Tests**: Fügen Sie Tests mit Jest hinzu (Expo unterstützt Jest standardmäßig). Führen Sie `npm test` aus.
- **Manuelle Tests**: Testen Sie Kamera-Berechtigungen, API-Aufrufe und Vorlesen auf verschiedenen Geräten.

## Installation auf iPhone

### Option 1: Expo Go (empfohlen für Tests)
1. Installieren Sie Expo Go auf Ihrem iPhone.
2. Starten Sie `npm start` und scannen Sie den QR-Code.

### Option 2: Native Build mit EAS (für Produktion)
1. Installieren Sie EAS CLI:
   ```
   npm install -g eas-cli
   ```

2. Melden Sie sich bei Expo an:
   ```
   eas login
   ```

3. Bauen Sie die iOS-App:
   ```
   eas build --platform ios
   ```

4. Laden Sie die IPA-Datei herunter und installieren Sie sie auf Ihrem iPhone (erfordert ein Apple Developer-Konto für die Verteilung).

## Installation auf Android

### Option 1: Expo Go (empfohlen für Tests)
1. Installieren Sie Expo Go auf Ihrem Android-Gerät.
2. Starten Sie `npm start` und scannen Sie den QR-Code.

### Option 2: Native Build mit EAS (für Produktion)
1. Installieren Sie EAS CLI (falls nicht bereits geschehen).
2. Melden Sie sich bei Expo an (falls nicht bereits geschehen).
3. Bauen Sie die Android-App:
   ```
   eas build --platform android
   ```

4. Laden Sie die APK-Datei herunter und installieren Sie sie auf Ihrem Android-Gerät.

## Hinweise

- **API-Schlüssel**: Speichern Sie Ihren OpenAI-API-Schlüssel sicher. Die App verwendet ihn für API-Aufrufe.
- **Kosten**: OpenAI-API-Aufrufe kosten Geld – überwachen Sie Ihr Guthaben.
- **Berechtigungen**: Stellen Sie sicher, dass Kamera-Berechtigungen in den Geräte-Einstellungen erteilt sind.
- **Fehlerbehebung**: Bei Problemen überprüfen Sie die Expo-Dokumentation oder die Logs im Terminal.
- **Anpassungen**: Der Code ist in `App.js`. Sie können ihn erweitern, z.B. um Offline-Modi oder zusätzliche Sprachen.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.