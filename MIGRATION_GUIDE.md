# Migration Guide: React Native New Architecture

This guide helps you migrate your existing `react-native-vlc-media-player` usage to take advantage of the new React Native architecture (Fabric).

## Table of Contents

- [What is the New Architecture?](#what-is-the-new-architecture)
- [Do I Need to Migrate?](#do-i-need-to-migrate)
- [Enabling New Architecture](#enabling-new-architecture)
- [Code Changes](#code-changes)
- [TypeScript Support](#typescript-support)
- [Troubleshooting](#troubleshooting)

## What is the New Architecture?

React Native's new architecture (introduced in RN 0.68+) includes:

- **Fabric**: A new rendering system that improves UI performance
- **TurboModules**: A new native module system for better performance
- **Synchronous Layout**: Better handling of layout calculations

This library now fully supports Fabric while maintaining backward compatibility.

## Do I Need to Migrate?

**No! Migration is optional.** The library works with both architectures:

- ✅ **Keep using the old architecture** - No changes needed, everything continues to work
- ✅ **Migrate to new architecture** - Get performance benefits and future-proof your app

## Enabling New Architecture

### Prerequisites

- React Native 0.68 or higher
- For best experience, use React Native 0.71+

### iOS Setup

1. Open `ios/Podfile` and add:

```ruby
# Enable Fabric (new architecture)
ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

2. Install pods:

```bash
cd ios
pod install
cd ..
```

3. Clean and rebuild:

```bash
cd ios
xcodebuild clean -workspace YourApp.xcworkspace -scheme YourApp
cd ..
npx react-native run-ios
```

### Android Setup

1. Open `android/gradle.properties` and add/update:

```properties
# Enable new architecture for Android
newArchEnabled=true
```

2. Clean and rebuild:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Code Changes

### Good News: No Changes Required!

Your existing code will continue to work as-is:

```javascript
// This code works with both old and new architectures
import { VLCPlayer } from 'react-native-vlc-media-player';

<VLCPlayer
  source={{ uri: 'https://example.com/video.mp4' }}
  onProgress={(e) => console.log(e.currentTime)}
  paused={false}
/>
```

### Optional: Use TypeScript for Better Type Safety

If you're using TypeScript, you can get enhanced type safety:

```typescript
import { VLCPlayer, type VLCPlayerRef, type VLCPlayerProps } from 'react-native-vlc-media-player/src';
import { useRef } from 'react';

function MyVideoPlayer() {
  const playerRef = useRef<VLCPlayerRef>(null);

  const handleSeek = () => {
    playerRef.current?.seek(0.5); // Seek to 50%
  };

  return (
    <VLCPlayer
      ref={playerRef}
      source={{ uri: 'https://example.com/video.mp4' }}
      onProgress={(e) => {
        // TypeScript knows the exact shape of 'e'
        console.log(e.currentTime, e.duration);
      }}
      paused={false}
    />
  );
}
```

## TypeScript Support

### New Type Definitions

The library now includes comprehensive TypeScript types:

```typescript
import type {
  VLCPlayerRef,
  VLCPlayerProps,
  VLCPlayerSource,
  OnVideoProgressEvent,
  OnVideoLoadEvent,
  OnVideoErrorEvent,
} from 'react-native-vlc-media-player/src';
```

### Event Types

All event handlers are now properly typed:

```typescript
// Progress event
onProgress={(event: { currentTime: number; duration: number; position: number }) => {
  console.log(`${event.currentTime}s / ${event.duration}s`);
}}

// Load event
onLoad={(event: { duration: number; videoSize?: { width: number; height: number } }) => {
  console.log('Video loaded:', event);
}}

// Error event
onError={(event: { error?: string; errorString?: string }) => {
  console.error('Video error:', event.error);
}}
```

### Ref Methods

The ref now has full TypeScript support:

```typescript
const playerRef = useRef<VLCPlayerRef>(null);

// All methods are typed
playerRef.current?.seek(0.5);
playerRef.current?.resume(true);
playerRef.current?.startRecording('/path/to/save');
playerRef.current?.stopRecording();
playerRef.current?.stopPlayer();
playerRef.current?.snapshot('/path/to/screenshot.jpg');
playerRef.current?.changeVideoAspectRatio('16:9');
playerRef.current?.autoAspectRatio(true);
```

## Troubleshooting

### iOS Build Errors

**Problem**: Build fails with Fabric-related errors

**Solution**: 
1. Clean derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
2. Clean pods: `cd ios && rm -rf Pods Podfile.lock && pod install`
3. Rebuild

### Android Build Errors

**Problem**: Build fails with "IS_NEW_ARCHITECTURE_ENABLED" errors

**Solution**:
1. Clean gradle: `cd android && ./gradlew clean`
2. Invalidate caches if using Android Studio
3. Rebuild

### Runtime Crashes

**Problem**: App crashes when playing video with new architecture enabled

**Solution**:
1. Check that you're using React Native 0.68 or higher
2. Verify CodeGen ran successfully (check `node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/viewmanagers/`)
3. Try disabling new architecture temporarily to isolate the issue

### TypeScript Errors

**Problem**: TypeScript can't find the types

**Solution**:
1. Ensure you're importing from the correct path: `react-native-vlc-media-player/src`
2. Check that your `tsconfig.json` includes the library's types
3. Try deleting `node_modules` and reinstalling

## Performance Benefits

With the new architecture enabled, you should see:

- ✅ Faster UI updates and smoother playback controls
- ✅ Better synchronization between video state and UI
- ✅ Reduced memory usage in some scenarios
- ✅ Future compatibility with React Native updates

## Rollback

If you encounter issues and need to rollback:

### iOS

```ruby
# In ios/Podfile, remove or comment out:
# ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

Then run: `cd ios && pod install`

### Android

```properties
# In android/gradle.properties, set:
newArchEnabled=false
```

Then run: `cd android && ./gradlew clean`

## Getting Help

If you encounter issues:

1. Check the [main README](./README.md) for setup instructions
2. Search [existing issues](https://github.com/mitchross/react-native-vlc-media-player/issues)
3. Create a new issue with:
   - React Native version
   - Platform (iOS/Android)
   - New architecture enabled (yes/no)
   - Full error message
   - Minimal reproduction code

## Additional Resources

- [React Native New Architecture Documentation](https://reactnative.dev/docs/new-architecture-intro)
- [Fabric Renderer](https://reactnative.dev/architecture/fabric-renderer)
- [TurboModules](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
