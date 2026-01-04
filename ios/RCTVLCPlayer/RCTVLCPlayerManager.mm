#import "RCTVLCPlayerManager.h"
#import "RCTVLCPlayer.h"
#import "React/RCTBridge.h"
#import "React/RCTUIManager.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTVLCPlayerComponentView.h"
#import <React/RCTViewComponentView.h>
#import <React/RCTConversions.h>
#import <react/renderer/components/RNVLCPlayerSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNVLCPlayerSpec/EventEmitters.h>
#import <react/renderer/components/RNVLCPlayerSpec/Props.h>
#import <react/renderer/components/RNVLCPlayerSpec/RCTComponentViewHelpers.h>
#import "RCTFabricComponentsPlugins.h"
#endif

@implementation RCTVLCPlayerManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
    return [[RCTVLCPlayer alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

/* Should support: onLoadStart, onLoad, and onError to stay consistent with Image */
RCT_EXPORT_VIEW_PROPERTY(onVideoProgress, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoPaused, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoStopped, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoBuffering, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoPlaying, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoEnded, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoError, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoOpen, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoLoadStart, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onVideoLoad, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onRecordingState, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onSnapshot, RCTDirectEventBlock);
#endif

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

#ifdef RCT_NEW_ARCH_ENABLED
#else
RCT_EXPORT_VIEW_PROPERTY(source, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(subtitleUri, NSString);
RCT_EXPORT_VIEW_PROPERTY(paused, BOOL);
RCT_EXPORT_VIEW_PROPERTY(seek, float);
RCT_EXPORT_VIEW_PROPERTY(rate, float);
RCT_EXPORT_VIEW_PROPERTY(resume, BOOL);
RCT_EXPORT_VIEW_PROPERTY(videoAspectRatio, NSString);
RCT_EXPORT_VIEW_PROPERTY(snapshotPath, NSString);
RCT_CUSTOM_VIEW_PROPERTY(muted, BOOL, RCTVLCPlayer)
{
    BOOL isMuted = [RCTConvert BOOL:json];
    [view setMuted:isMuted];
};
RCT_EXPORT_VIEW_PROPERTY(audioTrack, int);
RCT_EXPORT_VIEW_PROPERTY(textTrack, int);
RCT_EXPORT_VIEW_PROPERTY(autoplay, BOOL);
RCT_EXPORT_VIEW_PROPERTY(acceptInvalidCertificates, BOOL);
#endif

RCT_EXPORT_METHOD(startRecording:(nonnull NSNumber*) reactTag withPath:(NSString *)path) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
#ifdef RCT_NEW_ARCH_ENABLED
        RCTVLCPlayerComponentView *view = (RCTVLCPlayerComponentView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RCTVLCPlayerComponentView class]]) {
            RCTLogError(@"Cannot find RCTVLCPlayerComponentView with tag #%@", reactTag);
            return;
        }
        [view startRecording:path];
#else
        RCTVLCPlayer *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RCTVLCPlayer class]]) {
            RCTLogError(@"Cannot find RCTVLCPlayer with tag #%@", reactTag);
            return;
        }
        [view startRecording:path];
#endif
    }];
}

RCT_EXPORT_METHOD(stopRecording:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
#ifdef RCT_NEW_ARCH_ENABLED
        RCTVLCPlayerComponentView *view = (RCTVLCPlayerComponentView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RCTVLCPlayerComponentView class]]) {
            RCTLogError(@"Cannot find RCTVLCPlayerComponentView with tag #%@", reactTag);
            return;
        }
        [view stopRecording];
#else
        RCTVLCPlayer *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RCTVLCPlayer class]]) {
            RCTLogError(@"Cannot find RCTVLCPlayer with tag #%@", reactTag);
            return;
        }
        [view stopRecording];
#endif
    }];
}

RCT_EXPORT_METHOD(stopPlayer:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
#ifdef RCT_NEW_ARCH_ENABLED
        RCTVLCPlayerComponentView *view = (RCTVLCPlayerComponentView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RCTVLCPlayerComponentView class]]) {
            RCTLogError(@"Cannot find RCTVLCPlayerComponentView with tag #%@", reactTag);
            return;
        }
        [view stopPlayer];
#else
        RCTVLCPlayer *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RCTVLCPlayer class]]) {
            RCTLogError(@"Cannot find RCTVLCPlayer with tag #%@", reactTag);
            return;
        }
        [view stopPlayer];
#endif
    }];
}

RCT_EXPORT_METHOD(snapshot:(nonnull NSNumber*) reactTag withPath:(NSString *)path) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
#ifdef RCT_NEW_ARCH_ENABLED
        RCTVLCPlayerComponentView *view = (RCTVLCPlayerComponentView *)viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RCTVLCPlayerComponentView class]]) {
            RCTLogError(@"Cannot find RCTVLCPlayerComponentView with tag #%@", reactTag);
            return;
        }
        [view snapshot:path];
#else
        RCTVLCPlayer *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[RCTVLCPlayer class]]) {
            RCTLogError(@"Cannot find RCTVLCPlayer with tag #%@", reactTag);
            return;
        }
        [view snapshot:path];
#endif
    }];
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<facebook::react::RCTVLCPlayerComponentDescriptor>();
}

Class<RCTComponentViewProtocol> RCTVLCPlayerCls(void);
#endif

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RCTVLCPlayerCls(void)
{
    return RCTVLCPlayerComponentView.class;
}
#endif
