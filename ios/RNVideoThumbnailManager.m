//
//  RNVideoThumbnailManager.m
//  RNVideoThumbnailManager
//
//  Created by Chris LeBlanc on 4/4/16.
//  Copyright © 2016 Clever Lever. All rights reserved.
//

#import "RNVideoThumbnailManager.h"

@implementation RNVideoThumbnailManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getThumbnail:(NSString *)path
                  callback:(RCTResponseSenderBlock)callback)
{
  NSURL *url = [NSURL fileURLWithPath:path];
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *imagePath = [paths objectAtIndex:0];
  NSString *fileName = @"thumb.jpeg";
  NSString *filePath = [NSString stringWithFormat:@"%@/%@", imagePath, fileName];
  
  AVAsset *asset = [AVAsset assetWithURL:url];
  AVAssetImageGenerator *gen = [[AVAssetImageGenerator alloc] initWithAsset:asset];
  gen.appliesPreferredTrackTransform = YES;
  CMTime time = CMTimeMakeWithSeconds(0,30);
  NSError *error = nil;
  CMTime actualTime;
  
  CGImageRef image = [gen copyCGImageAtTime:time actualTime:&actualTime error:&error];
  UIImage *thumb = [[UIImage alloc] initWithCGImage:image];
  CGImageRelease(image);
  
  NSData *data = UIImageJPEGRepresentation(thumb, 0.2);
  [data writeToFile:filePath atomically:YES];

  callback(@[[NSNull null], filePath]);
}

@end
