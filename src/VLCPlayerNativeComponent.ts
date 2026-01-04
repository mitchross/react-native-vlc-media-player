import type { ViewProps, HostComponent } from 'react-native';
import type { 
  Int32, 
  Float, 
  Double,
  DirectEventHandler 
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

// Event payload types
export type OnVideoLoadStartEvent = Readonly<{
  target?: Int32;
}>;

export type OnVideoLoadEvent = Readonly<{
  duration: Float;
  target: Int32;
  videoSize?: Readonly<{
    width: Int32;
    height: Int32;
  }>;
  audioTracks?: ReadonlyArray<Readonly<{
    id: Int32;
    name: string;
  }>>;
  textTracks?: ReadonlyArray<Readonly<{
    id: Int32;
    name: string;
  }>>;
}>;

export type OnVideoOpenEvent = Readonly<{
  target?: Int32;
}>;

export type OnVideoProgressEvent = Readonly<{
  currentTime: Float;
  duration: Float;
  position: Float;
  remainingTime: Float;
  target?: Int32;
}>;

export type OnVideoPausedEvent = Readonly<{
  target?: Int32;
}>;

export type OnVideoStoppedEvent = Readonly<{
  target?: Int32;
}>;

export type OnVideoErrorEvent = Readonly<{
  error?: string;
  errorString?: string;
  target?: Int32;
}>;

export type OnVideoBufferingEvent = Readonly<{
  isBuffering?: boolean;
  target?: Int32;
}>;

export type OnVideoPlayingEvent = Readonly<{
  duration: Float;
  seekable?: boolean;
  target?: Int32;
}>;

export type OnVideoEndedEvent = Readonly<{
  target?: Int32;
}>;

export type OnRecordingStateEvent = Readonly<{
  isRecording: boolean;
  recordPath?: string;
}>;

export type OnSnapshotEvent = Readonly<{
  success: boolean;
  path?: string;
  error?: string;
}>;

export type VideoSource = Readonly<{
  uri?: string;
  type?: string;
  isNetwork?: boolean;
  isAsset?: boolean;
  autoplay?: boolean;
  initType?: Int32;
  initOptions?: ReadonlyArray<string>;
  mainVer?: Int32;
  patchVer?: Int32;
}>;

// Component props
export interface VLCPlayerNativeProps extends ViewProps {
  source?: VideoSource;
  src?: VideoSource;
  subtitleUri?: string;
  paused?: boolean;
  muted?: boolean;
  volume?: Int32;
  seek?: Float;
  resume?: boolean;
  rate?: Float;
  videoAspectRatio?: string;
  autoAspectRatio?: boolean;
  textTrack?: Int32;
  audioTrack?: Int32;
  progressUpdateInterval?: Float;
  recordingPath?: string;
  autoplay?: boolean;
  acceptInvalidCertificates?: boolean;
  
  // Event handlers (using Direct events for new architecture)
  onVideoLoadStart?: DirectEventHandler<OnVideoLoadStartEvent>;
  onVideoLoad?: DirectEventHandler<OnVideoLoadEvent>;
  onVideoOpen?: DirectEventHandler<OnVideoOpenEvent>;
  onVideoProgress?: DirectEventHandler<OnVideoProgressEvent>;
  onVideoPaused?: DirectEventHandler<OnVideoPausedEvent>;
  onVideoStopped?: DirectEventHandler<OnVideoStoppedEvent>;
  onVideoBuffering?: DirectEventHandler<OnVideoBufferingEvent>;
  onVideoPlaying?: DirectEventHandler<OnVideoPlayingEvent>;
  onVideoEnded?: DirectEventHandler<OnVideoEndedEvent>;
  onVideoError?: DirectEventHandler<OnVideoErrorEvent>;
  onRecordingState?: DirectEventHandler<OnRecordingStateEvent>;
  onSnapshot?: DirectEventHandler<OnSnapshotEvent>;
}

// Native commands interface
export interface NativeCommands {
  startRecording: (
    viewRef: React.ElementRef<HostComponent<VLCPlayerNativeProps>>,
    path: string
  ) => void;
  stopRecording: (
    viewRef: React.ElementRef<HostComponent<VLCPlayerNativeProps>>
  ) => void;
  stopPlayer: (
    viewRef: React.ElementRef<HostComponent<VLCPlayerNativeProps>>
  ) => void;
  snapshot: (
    viewRef: React.ElementRef<HostComponent<VLCPlayerNativeProps>>,
    path: string
  ) => void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['startRecording', 'stopRecording', 'stopPlayer', 'snapshot']
});

export default codegenNativeComponent<VLCPlayerNativeProps>('RCTVLCPlayer');
