# Sample App Screenshots & Features

## Overview

The VLC Player Sample app provides a comprehensive testing environment for the react-native-vlc-media-player library with full support for the new React Native architecture (Fabric).

## App Structure

### Main Screen Layout

```
┌─────────────────────────────────────┐
│  VLC Media Player Sample            │ ← Header
│  Testing New Architecture Support   │
├─────────────────────────────────────┤
│                                     │
│         [Video Player]              │ ← 16:9 Video Area
│                                     │
│         Buffering...                │ ← Buffering Overlay
├─────────────────────────────────────┤
│  Big Buck Bunny (MP4)               │ ← Video Info
│  0:45 / 10:34                       │ ← Time Display
│  Duration: 634s                     │ ← Metadata
│  Video Size: 1920x1080              │
├─────────────────────────────────────┤
│  Playback Controls                  │
│  [▶️ Play] [🔊 Mute]                │
│                                     │
│  Seek Controls                      │
│  [⏮️ Start][25%][50%][75%]          │
│                                     │
│  Playback Speed                     │
│  [0.5x][1.0x][1.5x][2.0x]          │
│                                     │
│  Volume: 100%                       │
│  [0%][50%][75%][100%]              │
│                                     │
│  Aspect Ratio                       │
│  [✓ Auto]                           │
│  [16:9][4:3][1:1][21:9][9:16]      │
│                                     │
│  Features                           │
│  [📸 Take Snapshot]                 │
│                                     │
│  Select Video Source                │
│  [✓ Big Buck Bunny (MP4)]          │
│  [Elephant Dream (MP4)]             │
│  [Sintel Trailer]                   │
│  [Test RTSP Stream]                 │
└─────────────────────────────────────┘
```

## Features Demonstrated

### 1. Video Playback
- **Multiple Sources**: Switch between different video URLs
- **Formats**: MP4, RTSP streaming
- **Network Handling**: HTTP and RTSP protocols
- **Autoplay**: Starts playing immediately on source change

### 2. Playback Controls
```typescript
// Play/Pause
setPaused(!paused)

// Mute/Unmute
setMuted(!muted)
```

### 3. Seek Controls
```typescript
// Jump to specific positions
handleSeek(0.0)   // Start (0%)
handleSeek(0.25)  // 25%
handleSeek(0.5)   // 50%
handleSeek(0.75)  // 75%
```

### 4. Playback Speed
```typescript
// Speed options
0.5x - Slow motion
1.0x - Normal speed
1.5x - Fast
2.0x - Very fast
```

### 5. Volume Control
```typescript
// Volume levels
setVolume(0)    // Muted
setVolume(50)   // Half volume
setVolume(75)   // 75%
setVolume(100)  // Full volume
```

### 6. Aspect Ratio
```typescript
// Manual aspect ratios
'16:9'  // Widescreen
'4:3'   // Classic TV
'1:1'   // Square
'21:9'  // Cinema
'9:16'  // Portrait/Vertical

// Or automatic
autoAspectRatio(true)
```

### 7. Advanced Features
```typescript
// Take snapshot
playerRef.current?.snapshot(path)
// Saves screenshot to filesystem

// Progress tracking
onProgress={(event) => {
  currentTime: event.currentTime,
  duration: event.duration,
  position: event.position,
  remainingTime: event.remainingTime
}}

// Buffering state
onBuffering={(event) => {
  isBuffering: event.isBuffering
}}
```

## Technical Implementation

### TypeScript Types
```typescript
import { VLCPlayer, type VLCPlayerRef } from 'react-native-vlc-media-player/src';

const playerRef = useRef<VLCPlayerRef>(null);

// Fully typed event handlers
const handleProgress = useCallback((event: OnVideoProgressEvent) => {
  setCurrentTime(event.currentTime);
  setDuration(event.duration);
}, []);
```

### New Architecture Support
```typescript
// Podfile (iOS)
ENV['RCT_NEW_ARCH_ENABLED'] = '1'

// gradle.properties (Android)
newArchEnabled=true
```

### Event Handling
```typescript
<VLCPlayer
  ref={playerRef}
  source={{ uri: videoUrl }}
  onLoadStart={handleLoadStart}
  onLoad={handleLoad}
  onProgress={handleProgress}
  onError={handleError}
  onBuffering={handleBuffering}
  onPlaying={handlePlaying}
  onPaused={handlePaused}
  onEnd={handleEnded}
/>
```

## Testing Scenarios

### 1. Network Streaming
- **Test**: Load remote MP4 files
- **Expected**: Smooth playback with progress updates
- **Verify**: Buffering states, time tracking

### 2. RTSP Streaming
- **Test**: Connect to RTSP stream
- **Expected**: Real-time streaming playback
- **Verify**: Low latency, stable connection

### 3. Playback Control
- **Test**: All control buttons
- **Expected**: Immediate response
- **Verify**: State updates, visual feedback

### 4. Aspect Ratio
- **Test**: Switch between ratios
- **Expected**: Video adjusts immediately
- **Verify**: No cropping issues, proper scaling

### 5. Seek Operations
- **Test**: Jump to different positions
- **Expected**: Accurate positioning
- **Verify**: Time display updates correctly

### 6. Speed Control
- **Test**: Change playback speed
- **Expected**: Smooth speed changes
- **Verify**: Audio pitch maintained (if supported)

### 7. Snapshot
- **Test**: Take screenshot during playback
- **Expected**: Image saved to filesystem
- **Verify**: File exists at specified path

## Performance Metrics

### With New Architecture (Fabric)
- ⚡ Faster UI updates (measured in frame renders)
- 🎯 Better synchronization (state → UI latency reduced)
- 📉 Lower memory footprint (compared to legacy)
- 🚀 Smoother animations and transitions

### Comparison Points
1. **Component Render Time**: Fabric vs Legacy
2. **Event Propagation**: Native → JS speed
3. **Memory Usage**: During playback
4. **Battery Consumption**: Extended playback test

## File Locations

### iOS
- App Bundle: `VLCPlayerSample.app`
- Snapshots: `/tmp/vlc-snapshot.jpg`
- Logs: Xcode console

### Android
- APK: `app/build/outputs/apk/`
- Snapshots: `/sdcard/vlc-snapshot.jpg`
- Logs: Logcat

## Error Handling

### Network Errors
```typescript
onError={(event) => {
  Alert.alert('Video Error', event.error || 'Unknown error');
}}
```

### Buffering States
```typescript
{isBuffering && (
  <View style={styles.bufferingOverlay}>
    <Text>Buffering...</Text>
  </View>
)}
```

## Customization

Users can easily modify:
- Video sources (add your own URLs)
- UI styling (colors, layout)
- Control options (add custom buttons)
- Event handlers (custom logic)

## Platform Differences

### iOS Specific
- Uses MobileVLCKit 3.5.1
- Requires NSLocalNetworkUsageDescription in Info.plist
- Supports background audio (if configured)

### Android Specific
- Uses libvlc-all 3.6.3
- Requires INTERNET permission
- Storage permissions for snapshots

## Next Steps

1. **Run the app** on both platforms
2. **Test all features** with different video sources
3. **Monitor performance** using developer tools
4. **Customize** as needed for your use case
5. **Report issues** if you find any

---

**Note**: This sample app is designed to be a comprehensive testing tool. Feel free to use it as a starting point for your own VLC player implementation!
