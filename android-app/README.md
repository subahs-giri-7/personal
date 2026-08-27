# Relayless Android

Native Android WebView wrapper for the deployed Relayless app.

## Build

Open the `android-app` folder in Android Studio and run the `app` configuration, or use the external toolchain:

```powershell
$env:JAVA_HOME = "C:\AndroidBuildTools\jdk17"
$env:ANDROID_SDK_ROOT = "C:\AndroidBuildTools\android-sdk"
& "C:\AndroidBuildTools\gradle-8.9\bin\gradle.bat" --no-daemon assembleDebug
```

The debug APK is generated at `app/build/outputs/apk/debug/app-debug.apk`.

The signed release APK is available outside the project at:

`C:\AndroidBuildTools\artifacts\Relayless-1.0.1.apk`

The release key is stored at `C:\AndroidBuildTools\relayless-release.jks`. Keep this key and its password private; future updates must use the same key to install over this release.

The app loads:

`https://subahs-giri-7.github.io/personal/index.html`

The WebView enables JavaScript, DOM storage, media playback, and browser navigation. External links open in the device browser.
