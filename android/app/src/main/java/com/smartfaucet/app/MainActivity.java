package com.smartfaucet.app;

import com.getcapacitor.BridgeActivity;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;

/**
 * Marker required by @capgo/capacitor-social-login if you pass custom OAuth scopes from JS.
 * (We omit custom scopes in code, but implementing this avoids plugin edge cases and future breaks.)
 */
public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {

  @Override
  public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {
    // no-op — confirms MainActivity was updated per Capgo Social Login Android requirements
  }
}
