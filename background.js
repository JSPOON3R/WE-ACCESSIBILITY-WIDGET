console.log("background.js loaded");

// Initial widget state from environment variables (if any)
let widgetState = {
  widgetColor1: (browser.webfuseSession?.env?.widgetColor1) || "black",
  widgetColor2: (browser.webfuseSession?.env?.widgetColor2) || "white",

  invertColors: (browser.webfuseSession?.env?.invertColors === "true"),
  grayscale: (browser.webfuseSession?.env?.grayscale === "true"),
  saturation: (browser.webfuseSession?.env?.saturation) || "none",         // 'none' | 'low' | 'high'
  underlineStyle: (browser.webfuseSession?.env?.underlineStyle) || "none", // 'none' | 'style0' | 'style1' | 'style2'
  fontSize: (browser.webfuseSession?.env?.fontSize) || "",                 // '', '1.3rem', '1.5rem', '1.8rem'
  contrast: (browser.webfuseSession?.env?.contrast) || "none",             // 'none' | 'low' | 'medium' | 'high'
  hideImages: (browser.webfuseSession?.env?.hideImages === "true"),
  hideVideo: (browser.webfuseSession?.env?.hideVideo === "true"),
  cursorMode: (browser.webfuseSession?.env?.cursorMode) || "none",         // 'none' | 'cursor0' | 'cursor1' | 'cursor2'
  position: (browser.webfuseSession?.env?.position) || "right"             // 'left' | 'top' | 'bottom' | 'right'
};

console.log("Initial widget state from env:", widgetState);

browser.runtime.onMessage.addListener((message, sender) => {
  console.log("Message received in background script:", message);
  if (!message || message.target !== "background") return;

  if (message.action === "get_widet_state") {
    if (message.from === "content") {
      provideWidgetStateToContent();
    } else if (message.from === "popup") {
      provideWidgetStateToPopup();
    }
  }

  if (message.action === "update_widget_state") {
    // Expecting: { updatedState: { ...partial } }
    if (message.updatedState && typeof message.updatedState === "object") {
      widgetState = { ...widgetState, ...message.updatedState };
      console.log("Updated widget state (background):", widgetState);

      // Push back to the same content tab that sent the update
        provideWidgetStateToContent();
    }
  }
});

function provideWidgetStateToContent() {
  browser.tabs.sendMessage(null, {
    target: "content",
    action: "set_widget_state",
    state: widgetState
  });
}

function provideWidgetStateToPopup() {
  browser.runtime.sendMessage({
    target: "popup",
    action: "set_widget_state",
    state: widgetState
  });
}