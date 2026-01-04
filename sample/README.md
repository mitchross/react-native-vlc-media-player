# VLC Media Player Sample App

This is a comprehensive sample React Native application demonstrating the full capabilities of the `react-native-vlc-media-player` library with support for both old and new React Native architectures (Fabric).

## Features Demonstrated

This sample app showcases:

✅ **Video Playback**
- MP4 streaming from HTTP sources
- RTSP stream support
- Multiple video source switching

✅ **Playback Controls**
- Play/Pause
- Seek to specific positions (0%, 25%, 50%, 75%, 100%)
- Playback speed control (0.5x, 1x, 1.5x, 2x)
- Volume control (0%, 50%, 75%, 100%)
- Mute/Unmute

✅ **Video Display**
- Aspect ratio control (16:9, 4:3, 1:1, 21:9, 9:16)
- Auto aspect ratio
- Full-screen capable

✅ **Advanced Features**
- Snapshot/screenshot capture
- Video progress tracking
- Buffering state display
- Video metadata display

✅ **New Architecture Support**
- TypeScript implementation
- Fabric UI layer (when enabled)
- Full type safety
- Event handling

## Prerequisites

- Node.js >= 16
- Package manager: npm, yarn, or **pnpm** (recommended)
- React Native development environment set up
- For iOS: Xcode 14+, CocoaPods
- For Android: Android Studio, JDK 11+

## Installation

This sample app supports multiple package managers. Choose your preferred option:

### Using pnpm (Recommended)

```bash
cd sample
pnpm install
```

The postinstall script will automatically run `pod install` for iOS.

### Using npm

```bash
cd sample
npm install
```

### Using yarn

```bash
cd sample
yarn install
```

### iOS Setup (if not using pnpm)

If you're using npm or yarn, you may need to manually install pods:

```bash
cd ios
pod install
cd ..
```

### Android Setup

No additional setup required. Gradle will handle dependencies.

## Running the App

### iOS

**With pnpm:**
```bash
pnpm run ios

# Or specify a device
pnpm run ios -- --simulator="iPhone 14 Pro"
```

**With npm:**
```bash
npm run ios

# Or specify a device
npm run ios -- --simulator="iPhone 14 Pro"
```

**With yarn:**
```bash
yarn ios

# Or specify a device
yarn ios -- --simulator="iPhone 14 Pro"
```

### Android

**With pnpm:**
```bash
pnpm run android

# Or specify a device
pnpm run android -- --deviceId=<device-id>
```

**With npm:**
```bash
npm run android

# Or specify a device
npm run android -- --deviceId=<device-id>
```

**With yarn:**
```bash
yarn android

# Or specify a device
yarn android -- --deviceId=<device-id>
```

## Architecture Modes

This sample app is configured to use the **New Architecture (Fabric)** by default.

### Current Configuration

- **iOS**: `ENV['RCT_NEW_ARCH_ENABLED'] = '1'` in `ios/Podfile`
- **Android**: `newArchEnabled=true` in `android/gradle.properties`

### Switching to Legacy Architecture

If you want to test with the legacy architecture:

**iOS:**
1. Open `ios/Podfile`
2. Comment out the line: `# ENV['RCT_NEW_ARCH_ENABLED'] = '1'`
3. Run `pod install` in the ios directory

**Android:**
1. Open `android/gradle.properties`
2. Change `newArchEnabled=true` to `newArchEnabled=false`
3. Clean and rebuild: `cd android && ./gradlew clean`

## Testing Different Features

### Testing Video Sources

The app includes several pre-configured video sources:

1. **Big Buck Bunny** - Standard MP4 HTTP stream
2. **Elephant Dream** - Another MP4 test video
3. **Sintel Trailer** - HD MP4 stream
4. **RTSP Test Stream** - Live RTSP streaming example

Switch between sources using the "Select Video Source" section.

### Testing Playback Controls

1. **Play/Pause**: Use the play/pause button
2. **Seek**: Tap any of the seek buttons (Start, 25%, 50%, 75%)
3. **Speed**: Change playback speed with speed buttons
4. **Volume**: Adjust volume or mute/unmute

### Testing Aspect Ratios

1. Enable "Auto" for automatic aspect ratio
2. Or select manual ratios: 16:9, 4:3, 1:1, 21:9, 9:16

### Testing Snapshot

1. Play a video
2. Tap "📸 Take Snapshot"
3. **iOS**: Saved to `/tmp/vlc-snapshot.jpg`
4. **Android**: Saved to `/sdcard/vlc-snapshot.jpg`

## Code Structure

```
sample/
├── src/
│   └── App.tsx           # Main application component
├── ios/                  # iOS native project
│   ├── Podfile          # CocoaPods configuration
│   └── VLCPlayerSample/ # iOS app files
├── android/             # Android native project
│   ├── build.gradle     # Root Gradle config
│   ├── gradle.properties # Gradle properties (new arch flag)
│   └── app/             # Android app module
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## TypeScript

This sample app is written in TypeScript to demonstrate:

- Full type safety with VLC player props
- Proper event typing
- Ref methods typing
- Better IDE support

All VLC player types are imported from:
```typescript
import { VLCPlayer, type VLCPlayerRef } from 'react-native-vlc-media-player/src';
```

## Troubleshooting

### iOS Build Issues

**Problem**: Build fails with Fabric errors

**Solution**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Android Build Issues

**Problem**: Build fails with gradle errors

**Solution**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Video Not Playing

**Problem**: Video shows black screen or error

**Solutions**:
1. Check network connectivity
2. Verify the video URL is accessible
3. Check console logs for error messages
4. Try a different video source

### Snapshot Not Working

**Problem**: Snapshot button doesn't create file

**Solutions**:
1. **Android**: Ensure WRITE_EXTERNAL_STORAGE permission is granted
2. **iOS**: Check file path permissions
3. Look for error messages in console

## Permissions

### iOS

The app requests:
- Network access (for streaming)
- Local network access (for RTSP/local servers)

Configured in `ios/VLCPlayerSample/Info.plist`

### Android

The app requests:
- INTERNET
- ACCESS_NETWORK_STATE
- WRITE_EXTERNAL_STORAGE (for snapshots)
- READ_EXTERNAL_STORAGE

Configured in `android/app/src/main/AndroidManifest.xml`

## Performance Testing

To test performance with the new architecture:

1. Enable React DevTools
2. Monitor component renders
3. Check memory usage
4. Test with different video sources
5. Compare with legacy architecture

## Known Limitations

See the main library's [KNOWN_ISSUES.md](../KNOWN_ISSUES.md) for platform-specific considerations.

## Contributing

Found an issue or want to add a feature to the sample app?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

This sample app is part of the react-native-vlc-media-player project and follows the same MIT license.

## Support

For issues with:
- **The sample app**: Open an issue in the main repository
- **The VLC player library**: See main [README.md](../README.md)
- **React Native**: Check [React Native documentation](https://reactnative.dev)

## Additional Resources

- [Main Library README](../README.md)
- [Migration Guide](../MIGRATION_GUIDE.md)
- [TypeScript Examples](../TYPESCRIPT_EXAMPLES.md)
- [Known Issues](../KNOWN_ISSUES.md)
- [React Native New Architecture](https://reactnative.dev/docs/new-architecture-intro)

---

**Happy Testing! 🎉**
