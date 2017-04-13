//
//  videoResizer.m
//  Episode
//
//  Created by 강민성 on 2017. 4. 10..
//  Copyright © 2017년 Facebook. All rights reserved.
//

#import "VideoResizer.h"
#import <AVFoundation/AVFoundation.h>
#import "SDAVAssetExportSession.h"

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

- (void)compressVideoWithSDAV:(NSURL*)inputURL
                    outputURL:(NSURL*)outputURL
                     fullPath:(NSString*)fullPath
                     callback:(RCTResponseSenderBlock)callback
{
  SDAVAssetExportSession *compressionEncoder = [SDAVAssetExportSession.alloc initWithAsset:[AVAsset assetWithURL:inputURL]]; // provide inputVideo Url Here
  compressionEncoder.outputFileType = AVFileTypeMPEG4;
  compressionEncoder.outputURL = outputURL; //Provide output video Url here
  compressionEncoder.videoSettings = @
  {
  AVVideoCodecKey: AVVideoCodecH264,
  AVVideoWidthKey: @630,   //Set your resolution width here 720
  AVVideoHeightKey:@1120,  //set your resolution height here 1280
  AVVideoCompressionPropertiesKey: @
    {
    AVVideoAverageBitRateKey: @1500000, // Give your bitrate here for lower size give low values 2000000
    AVVideoProfileLevelKey: AVVideoProfileLevelH264High40,
    },
  };
  compressionEncoder.audioSettings = @
  {
  AVFormatIDKey: @(kAudioFormatMPEG4AAC),
  AVNumberOfChannelsKey: @2,
  AVSampleRateKey: @44100,
  AVEncoderBitRateKey: @128000,
  };
  
  [compressionEncoder exportAsynchronouslyWithCompletionHandler:^
   {
     if (compressionEncoder.status == AVAssetExportSessionStatusCompleted)
     {
       NSLog(@"Compression Export Completed Successfully");
       NSData *originalDataForUpload = [NSData dataWithContentsOfURL:inputURL];
       NSLog(@"Size of original Video before compression is (bytes):%lu",[originalDataForUpload length]);
       NSData *newDataForUpload = [NSData dataWithContentsOfURL:outputURL];
       NSLog(@"Size of new Video after compression is (bytes):%lu",[newDataForUpload length]);
       
       callback(@[[NSNull null], fullPath]);
     }
     else if (compressionEncoder.status == AVAssetExportSessionStatusCancelled)
     {
       NSLog(@"Compression Export Canceled");
     }
     else
     {
       NSLog(@"Compression Failed");
       NSLog(@"Video FALIED: %@",compressionEncoder.error);
     }
   }];
  
}

RCT_EXPORT_METHOD(createResizedVideoWithSDAV:(NSString *)path
                  outputPath:(NSString *)outputPath
                  callback:(RCTResponseSenderBlock)callback)
{
  NSString* fullPath = generateMovieFilePath(@"mov", outputPath);
  NSURL *videoURL = [[NSURL alloc] initFileURLWithPath:path];
  NSURL *outputURL = [[NSURL alloc] initFileURLWithPath:fullPath];
  
  NSLog(@"Input: %@", path);
  NSLog(@"Output: %@", fullPath);
  NSLog(@"Video resize started!");
  [self compressVideoWithSDAV:videoURL outputURL:outputURL fullPath:fullPath callback:callback];
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
