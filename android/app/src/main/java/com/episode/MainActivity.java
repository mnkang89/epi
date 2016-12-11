package com.episode;

import com.facebook.react.ReactActivity;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.wix.RNCameraKit.RNCameraKitPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Episode";
    }
}
