# TypeScript Usage Examples

This file demonstrates how to use `react-native-vlc-media-player` with TypeScript and the new architecture.

## Basic Usage

```typescript
import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { VLCPlayer, type VLCPlayerRef } from 'react-native-vlc-media-player/src';

export default function VideoPlayer() {
  const playerRef = useRef<VLCPlayerRef>(null);
  const [paused, setPaused] = useState(false);

  return (
    <View style={styles.container}>
      <VLCPlayer
        ref={playerRef}
        source={{
          uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          initOptions: ['--network-caching=1000'],
        }}
        style={styles.video}
        paused={paused}
        autoplay={true}
        onLoad={(event) => {
          console.log('Video loaded:', event.duration, 'seconds');
        }}
        onProgress={(event) => {
          console.log('Progress:', event.currentTime, '/', event.duration);
        }}
        onError={(event) => {
          console.error('Video error:', event.error);
        }}
      />

      <View style={styles.controls}>
        <Button
          title={paused ? 'Play' : 'Pause'}
          onPress={() => setPaused(!paused)}
        />
        <Button
          title="Seek to 50%"
          onPress={() => playerRef.current?.seek(0.5)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
```

## RTSP Stream with Authentication

```typescript
import React from 'react';
import { VLCPlayer } from 'react-native-vlc-media-player/src';

export default function RTSPPlayer() {
  return (
    <VLCPlayer
      source={{
        uri: 'rtsp://username:password@192.168.1.100:554/stream',
        initType: 2,
        initOptions: [
          '--rtsp-tcp',
          '--network-caching=1500',
          '--rtsp-frame-buffer-size=500000',
        ],
      }}
      style={{ flex: 1 }}
      autoplay={true}
    />
  );
}
```

## Recording and Snapshots

```typescript
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { VLCPlayer, type VLCPlayerRef } from 'react-native-vlc-media-player/src';
import RNFS from 'react-native-fs';

export default function RecordingPlayer() {
  const playerRef = useRef<VLCPlayerRef>(null);

  const startRecording = async () => {
    const path = `${RNFS.DocumentDirectoryPath}/recording_${Date.now()}.mp4`;
    playerRef.current?.startRecording(path);
    console.log('Recording started to:', path);
  };

  const stopRecording = () => {
    playerRef.current?.stopRecording();
    console.log('Recording stopped');
  };

  const takeSnapshot = async () => {
    const path = `${RNFS.DocumentDirectoryPath}/snapshot_${Date.now()}.jpg`;
    playerRef.current?.snapshot(path);
    console.log('Snapshot saved to:', path);
  };

  return (
    <View style={{ flex: 1 }}>
      <VLCPlayer
        ref={playerRef}
        source={{
          uri: 'rtsp://192.168.1.100:554/stream',
        }}
        style={{ flex: 1 }}
        onRecordingCreated={(path) => {
          console.log('Recording created at:', path);
        }}
        onSnapshot={(event) => {
          if (event.success) {
            console.log('Snapshot saved:', event.path);
          } else {
            console.error('Snapshot failed:', event.error);
          }
        }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <Button title="Start Recording" onPress={startRecording} />
        <Button title="Stop Recording" onPress={stopRecording} />
        <Button title="Take Snapshot" onPress={takeSnapshot} />
      </View>
    </View>
  );
}
```

## Multiple Audio/Subtitle Tracks

```typescript
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player/src';

export default function MultiTrackPlayer() {
  const [audioTrack, setAudioTrack] = useState(0);
  const [textTrack, setTextTrack] = useState(-1);
  const [tracks, setTracks] = useState<{
    audioTracks: Array<{ id: number; name: string }>;
    textTracks: Array<{ id: number; name: string }>;
  }>({ audioTracks: [], textTracks: [] });

  return (
    <View style={{ flex: 1 }}>
      <VLCPlayer
        source={{
          uri: 'https://example.com/video-with-multiple-tracks.mkv',
        }}
        style={{ flex: 1 }}
        audioTrack={audioTrack}
        textTrack={textTrack}
        onLoad={(event) => {
          if (event.audioTracks && event.textTracks) {
            setTracks({
              audioTracks: event.audioTracks,
              textTracks: event.textTracks,
            });
          }
        }}
      />

      <View style={{ padding: 10 }}>
        <Text>Audio Tracks:</Text>
        {tracks.audioTracks.map((track) => (
          <Button
            key={track.id}
            title={`${track.name} ${audioTrack === track.id ? '✓' : ''}`}
            onPress={() => setAudioTrack(track.id)}
          />
        ))}

        <Text style={{ marginTop: 10 }}>Subtitle Tracks:</Text>
        <Button
          title={`Disable ${textTrack === -1 ? '✓' : ''}`}
          onPress={() => setTextTrack(-1)}
        />
        {tracks.textTracks.map((track) => (
          <Button
            key={track.id}
            title={`${track.name} ${textTrack === track.id ? '✓' : ''}`}
            onPress={() => setTextTrack(track.id)}
          />
        ))}
      </View>
    </View>
  );
}
```

## Custom Aspect Ratio

```typescript
import React, { useState, useRef } from 'react';
import { View, Button } from 'react-native';
import { VLCPlayer, type VLCPlayerRef } from 'react-native-vlc-media-player/src';

export default function AspectRatioPlayer() {
  const playerRef = useRef<VLCPlayerRef>(null);
  const [autoAspect, setAutoAspect] = useState(false);

  const aspectRatios = ['16:9', '4:3', '1:1', '21:9'];

  return (
    <View style={{ flex: 1 }}>
      <VLCPlayer
        ref={playerRef}
        source={{
          uri: 'https://example.com/video.mp4',
        }}
        style={{ flex: 1 }}
        autoAspectRatio={autoAspect}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <Button
          title={autoAspect ? 'Disable Auto' : 'Enable Auto'}
          onPress={() => {
            const newAuto = !autoAspect;
            setAutoAspect(newAuto);
            playerRef.current?.autoAspectRatio(newAuto);
          }}
        />
        {aspectRatios.map((ratio) => (
          <Button
            key={ratio}
            title={ratio}
            onPress={() => {
              setAutoAspect(false);
              playerRef.current?.changeVideoAspectRatio(ratio);
            }}
          />
        ))}
      </View>
    </View>
  );
}
```

## Advanced: All Props and Events

```typescript
import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { VLCPlayer, type VLCPlayerRef, type VLCPlayerProps } from 'react-native-vlc-media-player/src';

export default function AdvancedPlayer() {
  const playerRef = useRef<VLCPlayerRef>(null);
  const [paused, setPaused] = useState(false);

  const vlcProps: VLCPlayerProps = {
    source: {
      uri: 'https://example.com/video.mp4',
      initType: 1,
      initOptions: ['--network-caching=1000'],
    },
    subtitleUri: 'https://example.com/subtitles.srt',
    paused: paused,
    repeat: false,
    rate: 1.0,
    volume: 100,
    muted: false,
    audioTrack: 0,
    textTrack: -1,
    videoAspectRatio: '16:9',
    autoAspectRatio: false,
    autoplay: true,
    acceptInvalidCertificates: false,
    style: styles.video,

    // Event handlers with full typing
    onLoadStart: () => {
      console.log('Video load started');
    },
    onLoad: (event) => {
      console.log('Video loaded:', {
        duration: event.duration,
        size: event.videoSize,
        audioTracks: event.audioTracks,
        textTracks: event.textTracks,
      });
    },
    onOpen: () => {
      console.log('Video opened');
    },
    onProgress: (event) => {
      console.log('Progress:', {
        currentTime: event.currentTime,
        duration: event.duration,
        position: event.position,
        remainingTime: event.remainingTime,
      });
    },
    onPaused: () => {
      console.log('Video paused');
    },
    onStopped: () => {
      console.log('Video stopped');
    },
    onPlaying: (event) => {
      console.log('Video playing:', {
        duration: event.duration,
        seekable: event.seekable,
      });
    },
    onEnd: () => {
      console.log('Video ended');
    },
    onError: (event) => {
      console.error('Video error:', event.error || event.errorString);
    },
    onBuffering: (event) => {
      console.log('Buffering:', event.isBuffering);
    },
    onRecordingCreated: (path) => {
      console.log('Recording created:', path);
    },
    onSnapshot: (event) => {
      if (event.success) {
        console.log('Snapshot saved:', event.path);
      } else {
        console.error('Snapshot error:', event.error);
      }
    },
  };

  return (
    <View style={styles.container}>
      <VLCPlayer ref={playerRef} {...vlcProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
});
```

## Type-Safe Ref Methods

```typescript
import { useRef } from 'react';
import type { VLCPlayerRef } from 'react-native-vlc-media-player/src';

function useVideoControls() {
  const playerRef = useRef<VLCPlayerRef>(null);

  const controls = {
    // Seek to position (0.0 - 1.0)
    seekTo: (position: number) => {
      playerRef.current?.seek(position);
    },

    // Resume/pause playback
    togglePause: (shouldResume: boolean) => {
      playerRef.current?.resume(shouldResume);
    },

    // Start recording
    startRecording: (path: string) => {
      playerRef.current?.startRecording(path);
    },

    // Stop recording
    stopRecording: () => {
      playerRef.current?.stopRecording();
    },

    // Stop player completely
    stop: () => {
      playerRef.current?.stopPlayer();
    },

    // Take snapshot
    takeSnapshot: (path: string) => {
      playerRef.current?.snapshot(path);
    },

    // Change aspect ratio
    setAspectRatio: (ratio: '16:9' | '4:3' | '1:1' | '21:9') => {
      playerRef.current?.changeVideoAspectRatio(ratio);
    },

    // Enable/disable auto aspect ratio
    setAutoAspectRatio: (enabled: boolean) => {
      playerRef.current?.autoAspectRatio(enabled);
    },
  };

  return { playerRef, controls };
}

// Usage
function MyPlayer() {
  const { playerRef, controls } = useVideoControls();

  return (
    <>
      <VLCPlayer ref={playerRef} source={{ uri: 'video.mp4' }} />
      <Button title="Seek to 50%" onPress={() => controls.seekTo(0.5)} />
      <Button title="Stop" onPress={controls.stop} />
    </>
  );
}
```
