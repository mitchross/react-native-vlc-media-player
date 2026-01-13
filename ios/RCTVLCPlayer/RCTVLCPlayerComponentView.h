#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

#if TARGET_OS_TV
#import <TVVLCKit/TVVLCKit.h>
#else
#import <MobileVLCKit/MobileVLCKit.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RCTVLCPlayerComponentView : RCTViewComponentView <VLCCustomDialogRendererProtocol>

@end

NS_ASSUME_NONNULL_END

#endif /* RCT_NEW_ARCH_ENABLED */
