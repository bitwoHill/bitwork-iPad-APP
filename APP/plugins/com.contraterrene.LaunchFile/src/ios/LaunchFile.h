#import <Cordova/CDV.h>

@interface LaunchFile : CDVPlugin <UIDocumentInteractionControllerDelegate>
@property (strong) UIDocumentInteractionController *doccontroller;
- (void)launchFile:(CDVInvokedUrlCommand*)command;

@end