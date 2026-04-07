# Suggested Improvements for MuseumArtScanner

## 1) Improve Runtime Reliability

- Add explicit TypeScript types for `photo` and `cameraRef` in `App.tsx` to avoid `null`/`any` runtime risks and improve editor safety.
- Add defensive handling for camera capture failures (`takePictureAsync`) with user-friendly error messaging.
- Cache the AI client instance (or initialize once) rather than recreating it per analysis request.
- Add timeout and retry behavior for network requests, especially in the Gemini client.

## 2) Strengthen Prompt and Response Quality

- Update `ARTWORK_ANALYSIS_PROMPT` to request structured output (e.g., title, artist confidence, period, medium, short story, uncertainty notes).
- Add guardrails to ask the model not to hallucinate and to clearly state when the artist is unknown.
- Normalize provider outputs into a shared typed shape before rendering, instead of using raw text directly.

## 3) Upgrade UX for Museum Context

- Add loading skeletons and partial progress states (capturing, uploading, analyzing, speaking).
- Add controls for speech playback: pause, resume, stop, and speech rate.
- Allow users to edit/crop the captured image before analysis.
- Add an analysis history screen so visitors can revisit previous scans.
- Add offline queueing (store images/results locally) and retry when network returns.

## 4) Privacy and Security

- Move API key handling to secure runtime config patterns (EAS secrets for production) and document the approach in README.
- Add image data retention policy and optional on-device deletion after analysis.
- Add explicit consent messaging before sending images to third-party AI providers.

## 5) Developer Experience and Test Coverage

- Add linting and formatting scripts (`eslint`, `prettier`) with CI checks.
- Add unit tests for provider factory selection and error paths.
- Add integration tests for AI client adapters using mocked HTTP responses.
- Add a lightweight state-management pattern (e.g., reducer) as app complexity grows.
- Add a `.env.example` and central config validation at app startup.

## 6) Performance and Cost Controls

- Resize/compress photos before upload to reduce latency and API cost.
- Allow model configuration by environment (`fast` vs `high-accuracy` profile).
- Add request budgeting/telemetry (count scans, average response time, failure rates).

## 7) Accessibility and Internationalization

- Add dynamic type support and improved contrast for low-light museum environments.
- Ensure all buttons include accessibility labels and role hints.
- Add multilingual prompt and speech output support.

## 8) Product Opportunities

- Add museum mode: context-aware prompts including gallery/room metadata.
- Add "compare similar works" and "artist timeline" follow-up actions.
- Add share/export card with artwork summary and citation caveat.
