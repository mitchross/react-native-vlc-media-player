import React, { useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { VLCPlayer, type VLCPlayerRef } from 'react-native-vlc-media-player/src';

// Sample video sources for testing
const VIDEO_SOURCES = [
  {
    name: 'Big Buck Bunny (MP4)',
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'network',
  },
  {
    name: 'Elephant Dream (MP4)',
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'network',
  },
  {
    name: 'Sintel Trailer',
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'network',
  },
  {
    name: 'Test RTSP Stream',
    uri: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
    type: 'rtsp',
  },
];

const ASPECT_RATIOS = ['16:9', '4:3', '1:1', '21:9', '9:16'];

const App = () => {
  const playerRef = useRef<VLCPlayerRef>(null);
  const [selectedVideo, setSelectedVideo] = useState(VIDEO_SOURCES[0]);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [rate, setRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoInfo, setVideoInfo] = useState<string>('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [autoAspectRatio, setAutoAspectRatio] = useState(false);

  // Event handlers
  const handleLoadStart = useCallback(() => {
    console.log('Video load started');
    setVideoInfo('Loading...');
  }, []);

  const handleLoad = useCallback((event: any) => {
    const info = `Duration: ${event.duration}s\nVideo Size: ${event.videoSize?.width}x${event.videoSize?.height}`;
    setVideoInfo(info);
    setDuration(event.duration);
    console.log('Video loaded:', event);
  }, []);

  const handleProgress = useCallback((event: any) => {
    setCurrentTime(event.currentTime);
    setDuration(event.duration);
  }, []);

  const handleError = useCallback((event: any) => {
    Alert.alert('Video Error', event.error || event.errorString || 'Unknown error');
    console.error('Video error:', event);
  }, []);

  const handleBuffering = useCallback((event: any) => {
    setIsBuffering(event.isBuffering ?? false);
  }, []);

  const handlePlaying = useCallback(() => {
    console.log('Video playing');
  }, []);

  const handlePaused = useCallback(() => {
    console.log('Video paused');
  }, []);

  const handleEnded = useCallback(() => {
    console.log('Video ended');
    Alert.alert('Playback Complete', 'The video has finished playing');
  }, []);

  // Control functions
  const handlePlayPause = useCallback(() => {
    setPaused(!paused);
  }, [paused]);

  const handleMuteToggle = useCallback(() => {
    setMuted(!muted);
  }, [muted]);

  const handleSeek = useCallback((position: number) => {
    playerRef.current?.seek(position);
  }, []);

  const handleRateChange = useCallback((newRate: number) => {
    setRate(newRate);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  const handleSnapshot = useCallback(() => {
    const path = Platform.select({
      ios: '/tmp/vlc-snapshot.jpg',
      android: '/sdcard/vlc-snapshot.jpg',
    }) || '/tmp/vlc-snapshot.jpg';
    
    playerRef.current?.snapshot(path);
    Alert.alert('Snapshot', `Snapshot saved to: ${path}`);
  }, []);

  const handleAspectRatioChange = useCallback((ratio: string) => {
    setSelectedAspectRatio(ratio);
    playerRef.current?.changeVideoAspectRatio(ratio);
  }, []);

  const handleAutoAspectRatioToggle = useCallback(() => {
    const newAuto = !autoAspectRatio;
    setAutoAspectRatio(newAuto);
    playerRef.current?.autoAspectRatio(newAuto);
  }, [autoAspectRatio]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>VLC Media Player Sample</Text>
        <Text style={styles.subHeaderText}>
          Testing New Architecture Support
        </Text>
      </View>

      {/* Video Player */}
      <View style={styles.playerContainer}>
        <VLCPlayer
          ref={playerRef}
          source={{
            uri: selectedVideo.uri,
            initOptions: [
              '--network-caching=1500',
              '--rtsp-tcp',
            ],
          }}
          style={styles.player}
          paused={paused}
          muted={muted}
          volume={volume}
          rate={rate}
          autoplay={true}
          videoAspectRatio={selectedAspectRatio}
          autoAspectRatio={autoAspectRatio}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onError={handleError}
          onBuffering={handleBuffering}
          onPlaying={handlePlaying}
          onPaused={handlePaused}
          onEnd={handleEnded}
        />
        
        {isBuffering && (
          <View style={styles.bufferingOverlay}>
            <Text style={styles.bufferingText}>Buffering...</Text>
          </View>
        )}
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {selectedVideo.name}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
        {videoInfo ? (
          <Text style={styles.detailText}>{videoInfo}</Text>
        ) : null}
      </View>

      {/* Controls */}
      <ScrollView style={styles.controlsContainer}>
        {/* Playback Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playback Controls</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePlayPause}>
              <Text style={styles.buttonText}>
                {paused ? '▶️ Play' : '⏸️ Pause'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleMuteToggle}>
              <Text style={styles.buttonText}>
                {muted ? '🔇 Unmute' : '🔊 Mute'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seek Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seek Controls</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleSeek(0)}>
              <Text style={styles.buttonText}>⏮️ Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleSeek(0.25)}>
              <Text style={styles.buttonText}>25%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleSeek(0.5)}>
              <Text style={styles.buttonText}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleSeek(0.75)}>
              <Text style={styles.buttonText}>75%</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Playback Speed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playback Speed</Text>
          <View style={styles.buttonRow}>
            {[0.5, 1.0, 1.5, 2.0].map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.smallButton,
                  rate === speed && styles.activeButton,
                ]}
                onPress={() => handleRateChange(speed)}>
                <Text style={styles.buttonText}>{speed}x</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Volume Control */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Volume: {volume}%</Text>
          <View style={styles.buttonRow}>
            {[0, 50, 75, 100].map((vol) => (
              <TouchableOpacity
                key={vol}
                style={[
                  styles.smallButton,
                  volume === vol && styles.activeButton,
                ]}
                onPress={() => handleVolumeChange(vol)}>
                <Text style={styles.buttonText}>{vol}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Aspect Ratio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aspect Ratio</Text>
          <TouchableOpacity
            style={[
              styles.button,
              autoAspectRatio && styles.activeButton,
            ]}
            onPress={handleAutoAspectRatioToggle}>
            <Text style={styles.buttonText}>
              {autoAspectRatio ? '✓ Auto' : 'Auto'}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            {ASPECT_RATIOS.map((ratio) => (
              <TouchableOpacity
                key={ratio}
                style={[
                  styles.smallButton,
                  selectedAspectRatio === ratio && !autoAspectRatio && styles.activeButton,
                ]}
                onPress={() => handleAspectRatioChange(ratio)}>
                <Text style={styles.buttonText}>{ratio}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSnapshot}>
            <Text style={styles.buttonText}>📸 Take Snapshot</Text>
          </TouchableOpacity>
        </View>

        {/* Video Source Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Video Source</Text>
          {VIDEO_SOURCES.map((source) => (
            <TouchableOpacity
              key={source.uri}
              style={[
                styles.button,
                selectedVideo.uri === source.uri && styles.activeButton,
              ]}
              onPress={() => setSelectedVideo(source)}>
              <Text style={styles.buttonText}>{source.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subHeaderText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  playerContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    position: 'relative',
  },
  player: {
    flex: 1,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bufferingText: {
    color: '#ffffff',
    fontSize: 16,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    color: '#888888',
    fontSize: 12,
    marginTop: 4,
  },
  detailText: {
    color: '#888888',
    fontSize: 11,
    marginTop: 4,
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  section: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    backgroundColor: '#3a3a3a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: '#3a3a3a',
    padding: 10,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default App;
