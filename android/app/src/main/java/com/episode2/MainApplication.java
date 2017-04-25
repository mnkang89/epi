package com.episode;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.bugsnag.BugsnagReactNative;
import com.reactnativenavigation.NavigationReactPackage;
import io.realm.react.RealmReactPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.rnfs.RNFSPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            BugsnagReactNative.getPackage(),
            new NavigationReactPackage(),
            new RealmReactPackage(),
            new ReactVideoPackage(),
            new ReactNativePushNotificationPackage(),
            new ReactNativePermissionsPackage(),
            new ImageResizerPackage(),
            new RNFSPackage(),
            new RCTCameraPackage(),
            new ReactNativeI18n(),
            new VectorIconsPackage(),
            new RNDeviceInfo(),
            new ReactNativeConfigPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
