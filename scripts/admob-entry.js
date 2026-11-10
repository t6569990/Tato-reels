import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

const ANDROID_TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';

async function startTatoAdMob() {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return;

  document.documentElement.classList.add('tato-admob-native');
  document.body.style.paddingBottom = '150px';

  try {
    let consent = await AdMob.requestConsentInfo();
    if (
      consent.isConsentFormAvailable &&
      consent.status === AdmobConsentStatus.REQUIRED
    ) {
      consent = await AdMob.showConsentForm();
    }

    if (!consent.canRequestAds) {
      console.info('[Tato AdMob] Ads not requested: consent is not ready.');
      return;
    }

    await AdMob.initialize();
    await AdMob.showBanner({
      adId: ANDROID_TEST_BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 70,
      isTesting: true,
    });
    console.info('[Tato AdMob] Google test banner requested.');
  } catch (error) {
    // Advertising must never prevent the editor from opening or working.
    console.warn('[Tato AdMob] Banner unavailable; editor remains active.', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startTatoAdMob, { once: true });
} else {
  void startTatoAdMob();
}
