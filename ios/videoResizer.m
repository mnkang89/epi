//
//  videoResizer.m
//  Episode
//
//  Created by 강민성 on 2017. 4. 10..
//  Copyright © 2017년 Facebook. All rights reserved.
//

#import "VideoResizer.h"
#import <AVFoundation/AVFoundation.h>

@implementation VideoResizer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

NSString * generateMovieFilePath(NSString * ext, NSString * outputPath)
{
  NSString* directory;
  
  if ([outputPath length] == 0) {
    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    directory = [paths firstObject];
  } else {
    directory = outputPath;
  }
  
  NSString* name = [[NSUUID UUID] UUIDString];
  NSString* fullName = [NSString stringWithFormat:@"%@.%@", name, ext];
  NSString* fullPath = [directory stringByAppendingPathComponent:fullName];
  
  return fullPath;
}

- (void)compressVideo:(NSURL*)inputURL
            outputURL:(NSURL*)outputURL
              handler:(void (^)(AVAssetExportSession*))completion  {
  AVURLAsset *urlAsset = [AVURLAsset URLAssetWithURL:inputURL options:nil];
  AVAssetExportSession *exportSession = [[AVAssetExportSession alloc] initWithAsset:urlAsset presetName:AVAssetExportPresetMediumQuality];
  
  exportSession.outputURL = outputURL;
  exportSession.outputFileType = AVFileTypeQuickTimeMovie;
  exportSession.shouldOptimizeForNetworkUse = YES;
  [exportSession exportAsynchronouslyWithCompletionHandler:^{
    completion(exportSession);
  }];
}

RCT_EXPORT_METHOD(createResizedVideo:(NSString *)path
                  outputPath:(NSString *)outputPath
                  callback:(RCTResponseSenderBlock)callback)
{
  NSString* fullPath = generateMovieFilePath(@"mov", outputPath);
  NSURL *videoUrl = [[NSURL alloc] initFileURLWithPath:path];
  NSURL *outputUrl = [[NSURL alloc] initFileURLWithPath:fullPath];
  
  NSLog(@"Input: %@", path);
  NSLog(@"Output: %@", fullPath);
  NSLog(@"Video resize started!");
  [self compressVideo:videoUrl outputURL:outputUrl handler:^(AVAssetExportSession *completion) {
    
    if (completion.status == AVAssetExportSessionStatusCompleted) {
      NSData *originalDataForUpload = [NSData dataWithContentsOfURL:videoUrl];
      NSLog(@"Size of original Video before compression is (bytes):%lu",[originalDataForUpload length]);
      NSData *newDataForUpload = [NSData dataWithContentsOfURL:outputUrl];
      NSLog(@"Size of new Video after compression is (bytes):%lu",[newDataForUpload length]);
      
      callback(@[[NSNull null], fullPath]);
    }
    else
    {
      NSLog(@"Video FALIED: %@",completion.error);
    }
  }];
}


@end
