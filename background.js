chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "logVisit") {
    // Save to visit log
    chrome.storage.local.get({ visitLog: [] }, (data) => {
      const log = data.visitLog;
      log.push({
        timestamp: new Date().toISOString(),
        url: msg.url,
        relevancy: msg.relevancy
      });
      chrome.storage.local.set({ visitLog: log });
    });

    // Show notification with score & warning
    const percent = (msg.relevancy * 100).toFixed(2);
    const title = `Relevancy: ${percent}%`;
    const message = percent < 50
      ? `⚠️ Only ${percent}% relevant to your purpose. Stay focused!`
      : `✅ This page matches your purpose well.`;

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: title,
      message: message
    });
  }
});
