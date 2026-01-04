import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Platform, UIManager, findNodeHandle } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import VLCPlayerNativeComponent, { 
  Commands, 
  type VLCPlayerNativeProps,
  type OnVideoProgressEvent,
  type OnVideoLoadEvent,
  type OnVideoErrorEvent,
  type OnVideoBufferingEvent,
  type OnVideoPlayingEvent,
  type OnVideoPausedEvent,
  type OnVideoStoppedEvent,
  type OnVideoEndedEvent,
  type OnRecordingStateEvent,
  type OnSnapshotEvent,
} from './VLCPlayerNativeComponent';

// Type for components with setNativeProps (legacy support)
interface NativePropsComponent {
  setNativeProps: (props: Record<string, unknown>) => void;
}

// Type for native events
interface NativeEvent<T> {
  nativeEvent: T;
}

export type VLCPlayerSource = {
  uri: string;
  initType?: 1 | 2;
  initOptions?: string[];
  type?: string;
  autoplay?: boolean;
  isNetwork?: boolean;
  isAsset?: boolean;
  mainVer?: number;
  patchVer?: number;
};

export type VLCPlayerRef = {
  seek: (time: number) => void;
  resume: (shouldResume: boolean) => void;
  startRecording: (path: string) => void;
  stopRecording: () => void;
  stopPlayer: () => void;
  snapshot: (path: string) => void;
  changeVideoAspectRatio: (ratio: string) => void;
  autoAspectRatio: (isAuto: boolean) => void;
};

export interface VLCPlayerProps {
  source?: VLCPlayerSource;
  subtitleUri?: string;
  paused?: boolean;
  muted?: boolean;
  volume?: number;
  rate?: number;
  videoAspectRatio?: string;
  autoAspectRatio?: boolean;
  textTrack?: number;
  audioTrack?: number;
  autoplay?: boolean;
  repeat?: boolean;
  acceptInvalidCertificates?: boolean;
  style?: StyleProp<ViewStyle>;
  
  // Event handlers
  onLoadStart?: () => void;
  onLoad?: (event: {
    duration: number;
    target: number;
    videoSize?: { width: number; height: number };
    audioTracks?: Array<{ id: number; name: string }>;
    textTracks?: Array<{ id: number; name: string }>;
  }) => void;
  onOpen?: () => void;
  onProgress?: (event: {
    currentTime: number;
    duration: number;
    position: number;
    remainingTime: number;
  }) => void;
  onPaused?: () => void;
  onStopped?: () => void;
  onPlaying?: (event: { duration: number; seekable?: boolean }) => void;
  onEnd?: () => void;
  onError?: (event: { error?: string; errorString?: string }) => void;
  onBuffering?: (event: { isBuffering?: boolean }) => void;
  onRecordingCreated?: (recordingPath: string) => void;
  onSnapshot?: (event: { success: boolean; path?: string; error?: string }) => void;
}

const VLCPlayer = forwardRef<VLCPlayerRef, VLCPlayerProps>((props, ref) => {
  const nativeRef = useRef<React.ElementRef<typeof VLCPlayerNativeComponent>>(null);
  const lastRecordingRef = useRef<string | null>(null);

  // Handle events
  const handleLoadStart = useCallback((_event: NativeEvent<Record<string, never>>) => {
    if (props.onLoadStart) {
      props.onLoadStart();
    }
  }, [props.onLoadStart]);

  const handleLoad = useCallback((event: NativeEvent<OnVideoLoadEvent>) => {
    if (props.onLoad) {
      props.onLoad(event.nativeEvent);
    }
  }, [props.onLoad]);

  const handleOpen = useCallback((_event: NativeEvent<Record<string, never>>) => {
    if (props.onOpen) {
      props.onOpen();
    }
  }, [props.onOpen]);

  const handleProgress = useCallback((event: NativeEvent<OnVideoProgressEvent>) => {
    if (props.onProgress) {
      props.onProgress(event.nativeEvent);
    }
  }, [props.onProgress]);

  const handlePaused = useCallback((_event: NativeEvent<OnVideoPausedEvent>) => {
    if (props.onPaused) {
      props.onPaused();
    }
  }, [props.onPaused]);

  const handleStopped = useCallback((_event: NativeEvent<OnVideoStoppedEvent>) => {
    if (props.onStopped) {
      props.onStopped();
    }
  }, [props.onStopped]);

  const handlePlaying = useCallback((event: NativeEvent<OnVideoPlayingEvent>) => {
    if (props.onPlaying) {
      props.onPlaying(event.nativeEvent);
    }
  }, [props.onPlaying]);

  const handleEnded = useCallback((_event: NativeEvent<OnVideoEndedEvent>) => {
    if (props.onEnd) {
      props.onEnd();
    }
  }, [props.onEnd]);

  const handleError = useCallback((event: NativeEvent<OnVideoErrorEvent>) => {
    if (props.onError) {
      props.onError(event.nativeEvent);
    }
  }, [props.onError]);

  const handleBuffering = useCallback((event: NativeEvent<OnVideoBufferingEvent>) => {
    if (props.onBuffering) {
      props.onBuffering(event.nativeEvent);
    }
  }, [props.onBuffering]);

  const handleRecordingState = useCallback((event: NativeEvent<OnRecordingStateEvent>) => {
    if (lastRecordingRef.current === event.nativeEvent.recordPath) {
      return;
    }

    if (!event.nativeEvent.isRecording && event.nativeEvent.recordPath) {
      lastRecordingRef.current = event.nativeEvent.recordPath;
      if (props.onRecordingCreated) {
        props.onRecordingCreated(lastRecordingRef.current);
      }
    }
  }, [props.onRecordingCreated]);

  const handleSnapshot = useCallback((event: { nativeEvent: { success: boolean; path?: string; error?: string } }) => {
    if (event.nativeEvent.success && props.onSnapshot) {
      props.onSnapshot(event.nativeEvent);
    }
  }, [props.onSnapshot]);

  useImperativeHandle(ref, () => ({
    seek: (time: number) => {
      // Use setNativeProps for compatibility
      if (nativeRef.current && 'setNativeProps' in nativeRef.current) {
        (nativeRef.current as unknown as NativePropsComponent).setNativeProps({ seek: time });
      }
    },
    resume: (shouldResume: boolean) => {
      if (nativeRef.current && 'setNativeProps' in nativeRef.current) {
        (nativeRef.current as unknown as NativePropsComponent).setNativeProps({ resume: shouldResume });
      }
    },
    startRecording: (path: string) => {
      if (nativeRef.current) {
        Commands.startRecording(nativeRef.current, path);
      }
    },
    stopRecording: () => {
      if (nativeRef.current) {
        Commands.stopRecording(nativeRef.current);
      }
    },
    stopPlayer: () => {
      if (nativeRef.current) {
        Commands.stopPlayer(nativeRef.current);
      }
    },
    snapshot: (path: string) => {
      if (nativeRef.current) {
        Commands.snapshot(nativeRef.current, path);
      }
    },
    changeVideoAspectRatio: (ratio: string) => {
      if (nativeRef.current && 'setNativeProps' in nativeRef.current) {
        (nativeRef.current as unknown as NativePropsComponent).setNativeProps({ videoAspectRatio: ratio });
      }
    },
    autoAspectRatio: (isAuto: boolean) => {
      if (nativeRef.current && 'setNativeProps' in nativeRef.current) {
        (nativeRef.current as unknown as NativePropsComponent).setNativeProps({ autoAspectRatio: isAuto });
      }
    },
  }));

  // Prepare source with repeat support
  const preparedSource = React.useMemo(() => {
    if (!props.source) return undefined;
    
    const source = { ...props.source };
    source.initOptions = source.initOptions || [];
    
    if (props.repeat) {
      const existingRepeat = source.initOptions.find(
        item => item.startsWith('--repeat') || item.startsWith('--input-repeat')
      );
      if (!existingRepeat) {
        source.initOptions = [...source.initOptions, '--repeat'];
      }
    }
    
    return source;
  }, [props.source, props.repeat]);

  // Prepare native props
  const nativeProps: VLCPlayerNativeProps = {
    ...props,
    source: preparedSource,
    src: preparedSource,
    progressUpdateInterval: props.onProgress ? 250 : 0,
    onVideoLoadStart: handleLoadStart,
    onVideoLoad: handleLoad,
    onVideoOpen: handleOpen,
    onVideoProgress: handleProgress,
    onVideoPaused: handlePaused,
    onVideoStopped: handleStopped,
    onVideoPlaying: handlePlaying,
    onVideoEnded: handleEnded,
    onVideoError: handleError,
    onVideoBuffering: handleBuffering,
    onRecordingState: handleRecordingState,
    onSnapshot: handleSnapshot,
  };

  return <VLCPlayerNativeComponent ref={nativeRef} {...nativeProps} />;
});

VLCPlayer.displayName = 'VLCPlayer';

export default VLCPlayer;
