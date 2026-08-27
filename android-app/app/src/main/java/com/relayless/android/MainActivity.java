package com.relayless.android;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import android.app.Activity;

public class MainActivity extends Activity {
    private static final String HOME_URL = "https://subahs-giri-7.github.io/personal/index.html";
    private WebView webView;
    private ProgressBar progress;
    private View errorView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.setStatusBarColor(Color.rgb(16, 19, 27));
        window.setNavigationBarColor(Color.rgb(16, 19, 27));

        FrameLayout root = new FrameLayout(this);
        webView = new WebView(this);
        progress = new ProgressBar(this);
        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(72, 72);
        progressParams.gravity = android.view.Gravity.CENTER;
        root.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        root.addView(progress, progressParams);
        errorView = createErrorView();
        errorView.setVisibility(View.GONE);
        root.addView(errorView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        webView.setBackgroundColor(Color.WHITE);
        webView.setWebViewClient(new RelaylessWebViewClient());
        webView.setWebChromeClient(new android.webkit.WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progress.setVisibility(newProgress < 100 ? View.VISIBLE : View.GONE);
            }
        });
        webView.loadUrl(HOME_URL);

    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    private View createErrorView() {
        FrameLayout panel = new FrameLayout(this);
        panel.setBackgroundColor(Color.WHITE);
        TextView message = new TextView(this);
        message.setText("Relayless\n\nWe could not load the app right now.");
        message.setTextColor(Color.rgb(16, 19, 27));
        message.setTextSize(18);
        message.setGravity(android.view.Gravity.CENTER);
        panel.addView(message, new FrameLayout.LayoutParams(-1, -2, android.view.Gravity.CENTER));
        Button retry = new Button(this);
        retry.setText("Retry");
        retry.setTextColor(Color.WHITE);
        retry.setBackgroundColor(Color.rgb(23, 105, 255));
        FrameLayout.LayoutParams retryParams = new FrameLayout.LayoutParams(-2, -2);
        retryParams.gravity = android.view.Gravity.CENTER_HORIZONTAL | android.view.Gravity.CENTER_VERTICAL;
        retryParams.topMargin = 130;
        panel.addView(retry, retryParams);
        retry.setOnClickListener(view -> {
            panel.setVisibility(View.GONE);
            progress.setVisibility(View.VISIBLE);
            webView.reload();
        });
        return panel;
    }

    private class RelaylessWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if ("subahs-giri-7.github.io".equals(uri.getHost())) return false;
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
            return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            progress.setVisibility(View.GONE);
            errorView.setVisibility(View.GONE);
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            if (request.isForMainFrame()) {
                progress.setVisibility(View.GONE);
                errorView.setVisibility(View.VISIBLE);
            }
        }
    }
}
