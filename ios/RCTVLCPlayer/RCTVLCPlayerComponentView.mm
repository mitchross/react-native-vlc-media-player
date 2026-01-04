#ifdef RCT_NEW_ARCH_ENABLED

#import "RCTVLCPlayerComponentView.h"
#import "RCTVLCPlayer.h"

#import <react/renderer/components/RNVLCPlayerSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNVLCPlayerSpec/EventEmitters.h>
#import <react/renderer/components/RNVLCPlayerSpec/Props.h>
#import <react/renderer/components/RNVLCPlayerSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCTVLCPlayerComponentView () <RCTRCTVLCPlayerViewProtocol>
@end

@implementation RCTVLCPlayerComponentView {
    RCTVLCPlayer *_playerView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RCTVLCPlayerComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RCTVLCPlayerProps>();
        _props = defaultProps;
        
        // Create the legacy player view without event dispatcher
        // We'll handle events through Fabric's event emitter
        _playerView = [[RCTVLCPlayer alloc] initWithEventDispatcher:nil];
        _playerView.frame = self.bounds;
        _playerView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        
        self.contentView = _playerView;
    }

    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<const RCTVLCPlayerProps>(_props);
    const auto &newViewProps = *std::static_pointer_cast<const RCTVLCPlayerProps>(props);

    // Handle source updates
    if (oldViewProps.source != newViewProps.source) {
        if (newViewProps.source) {
            NSMutableDictionary *source = [NSMutableDictionary new];
            if (newViewProps.source.uri) {
                source[@"uri"] = [NSString stringWithUTF8String:newViewProps.source.uri->c_str()];
            }
            if (newViewProps.source.isNetwork) {
                source[@"isNetwork"] = @(newViewProps.source.isNetwork.value_or(false));
            }
            if (newViewProps.source.autoplay) {
                source[@"autoplay"] = @(newViewProps.source.autoplay.value_or(true));
            }
            if (newViewProps.source.initType) {
                source[@"initType"] = @(newViewProps.source.initType.value_or(1));
            }
            if (newViewProps.source.initOptions && newViewProps.source.initOptions->size() > 0) {
                NSMutableArray *options = [NSMutableArray new];
                for (const auto &option : *newViewProps.source.initOptions) {
                    [options addObject:[NSString stringWithUTF8String:option.c_str()]];
                }
                source[@"initOptions"] = options;
            }
            [_playerView setSource:source];
        }
    }

    // Handle subtitle URI
    if (oldViewProps.subtitleUri != newViewProps.subtitleUri) {
        if (newViewProps.subtitleUri) {
            NSString *subtitleUri = [NSString stringWithUTF8String:newViewProps.subtitleUri->c_str()];
            [_playerView setSubtitleUri:subtitleUri];
        }
    }

    // Handle paused state
    if (oldViewProps.paused != newViewProps.paused) {
        [_playerView setPaused:newViewProps.paused];
    }

    // Handle muted state
    if (oldViewProps.muted != newViewProps.muted) {
        [_playerView setMuted:newViewProps.muted];
    }

    // Handle volume
    if (oldViewProps.volume != newViewProps.volume) {
        [_playerView setVolume:newViewProps.volume];
    }

    // Handle seek
    if (oldViewProps.seek != newViewProps.seek) {
        [_playerView setSeek:newViewProps.seek];
    }

    // Handle rate
    if (oldViewProps.rate != newViewProps.rate) {
        [_playerView setRate:newViewProps.rate];
    }

    // Handle resume
    if (oldViewProps.resume != newViewProps.resume) {
        [_playerView setResume:newViewProps.resume];
    }

    // Handle video aspect ratio
    if (oldViewProps.videoAspectRatio != newViewProps.videoAspectRatio) {
        if (newViewProps.videoAspectRatio) {
            NSString *ratio = [NSString stringWithUTF8String:newViewProps.videoAspectRatio->c_str()];
            [_playerView setVideoAspectRatio:ratio];
        }
    }

    // Handle auto aspect ratio
    if (oldViewProps.autoAspectRatio != newViewProps.autoAspectRatio) {
        [_playerView setAutoAspectRatio:newViewProps.autoAspectRatio];
    }

    // Handle audio track
    if (oldViewProps.audioTrack != newViewProps.audioTrack) {
        [_playerView setAudioTrack:newViewProps.audioTrack];
    }

    // Handle text track
    if (oldViewProps.textTrack != newViewProps.textTrack) {
        [_playerView setTextTrack:newViewProps.textTrack];
    }

    // Handle autoplay
    if (oldViewProps.autoplay != newViewProps.autoplay) {
        [_playerView setAutoplay:newViewProps.autoplay];
    }

    // Handle accept invalid certificates
    if (oldViewProps.acceptInvalidCertificates != newViewProps.acceptInvalidCertificates) {
        [_playerView setAcceptInvalidCertificates:newViewProps.acceptInvalidCertificates];
    }

    [super updateProps:props oldProps:oldProps];
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    RCTRCTVLCPlayerHandleCommand(self, commandName, args);
}

- (void)startRecording:(NSString *)path
{
    [_playerView startRecording:path];
}

- (void)stopRecording
{
    [_playerView stopRecording];
}

- (void)stopPlayer
{
    [_playerView stopPlayer];
}

- (void)snapshot:(NSString *)path
{
    [_playerView snapshot:path];
}

@end

Class<RCTComponentViewProtocol> RCTVLCPlayerCls(void)
{
    return RCTVLCPlayerComponentView.class;
}

#endif /* RCT_NEW_ARCH_ENABLED */
