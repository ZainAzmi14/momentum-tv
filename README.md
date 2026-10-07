# Momentum TV

Momentum TV is a React Native CLI app for Android TV and Fire TV, built with
the `react-native-tvos` fork. It uses the Momentum API for dashboard content.

## Requirements

- Node.js 22 (`nvm use`)
- JDK 17
- Android SDK Platform 35 and Build Tools 35.0.0
- An Android TV/Fire TV device or emulator

## Install and run

```sh
npm ci
npm start
```

In another terminal, start the Android TV app:

```sh
npm run android
```

The app requires Leanback and can be launched from the TV launcher. Android
debug builds allow HTTP for local API development; release builds do not.

## API setup

The Android emulator reaches the host machine at `10.0.2.2`. Set `API_PORT`
and `DASHBOARD_PATH` in `src/api/config.ts` to match the local Momentum API.
Replace the production URL in that file before creating a release build. On a
physical TV device, use an API hostname/IP reachable from that device instead
of the emulator-only `10.0.2.2` address.

Generate API types directly from the Momentum API OpenAPI document:

```sh
MOMENTUM_API_SPEC_URL=http://localhost:5000/swagger/v1/swagger.json npm run api:generate
```

The default spec URL uses port 5000. Generated types are written to
`src/api/generated/api.d.ts`; do not hand-edit files in that directory.

The dashboard currently expects a JSON array or an object with an `items`
array. Items can contain `id`, `title`/`name`, `description`/`summary`, and
`imageUrl` (or `image`/`thumbnail`). Confirm the endpoint and response fields
against the API's Swagger document before deploying.

## Checks

```sh
npm run lint
npm run typecheck
npm test
```

The Device diagnostics screen reports device model, OS version, total RAM,
network connectivity, and screen resolution.
