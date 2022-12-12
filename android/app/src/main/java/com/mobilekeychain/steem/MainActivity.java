package com.mobilekeychain.steem;

import android.os.Bundle; // <- add this necessary import

import com.zoontek.rnbootsplash.RNBootSplash; // <- add this necessary import


import com.facebook.react.ReactActivity;

import android.content.Intent; // <--- import
import android.content.res.Configuration; // <--- import

import expo.modules.ReactActivityDelegateWrapper;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "mobileKeychain";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(null);
        RNBootSplash.init(R.drawable.bootsplash, MainActivity.this); // display the generated bootsplash.xml drawable over our MainActivity
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegateWrapper(
                this,
                new ReactActivityDelegate(this, getMainComponentName()) {
                    @Override
                    protected ReactRootView createRootView() {
                        return new RNGestureHandlerEnabledRootView(MainActivity.this);
                    }
                }
        );
    }

    public static class MainActivityDelegate extends ReactActivityDelegate {
        public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
            super(activity, mainComponentName);
        }

        @Override
        protected ReactRootView createRootView() {
            ReactRootView reactRootView = new ReactRootView(getContext());
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            New delegate and enabling Fabric in ReactRootView is only required for the
            new architecture builds.
                    reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
            return reactRootView;
        }

        @Override
        protected boolean isConcurrentRootEnabled() {
            // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
            // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
    }
}
