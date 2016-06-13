#import "LaunchFile.h"
#import <Cordova/CDV.h>
#import <Cordova/CDVViewController.h>
@implementation LaunchFile
// Hat tip to Andrew Trice, http://www.tricedesigns.com/2012/08/15/open-with-in-ios-phonegap-apps/
- (void)launchFile:(CDVInvokedUrlCommand*)command
{
	NSString* fileuri = [command.arguments objectAtIndex:0];
	NSString* escapeduri = [fileuri stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
	NSURL* fileURL = [NSURL URLWithString:escapeduri];	
	_doccontroller = [UIDocumentInteractionController  interactionControllerWithURL:fileURL];
	_doccontroller.delegate = self;
	CDVViewController* cont = (CDVViewController*)[ super viewController ];
	CGRect rect =  CGRectMake(0, 0, 1500.0f, 50.0f);
	[_doccontroller presentOptionsMenuFromRect:rect inView:cont.view animated:YES];
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Opened."];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end