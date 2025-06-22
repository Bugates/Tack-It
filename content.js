(async () => {
  // Dynamically load transformers.js from CDN
  await import('https://cdn.jsdelivr.net/npm/@xenova/transformers');

  const { pipeline } = window.transformers;

  // Create embedding pipeline
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  // Get page text (title or hostname fallback)
  const pageText = document.title || window.location.hostname;

  // Get user purpose
  chrome.storage.local.get(['userPurpose'], async (result) => {
    const userPurpose = result.userPurpose || "focus";

    // Get embeddings for page & purpose
    const embeddings = await extractor([pageText, userPurpose]);

    // Compute cosine similarity
    const [vecA, vecB] = embeddings;
    const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    const similarity = dot / (magA * magB);

    // Send to background for logging + notification
    chrome.runtime.sendMessage({
      type: "logVisit",
      url: window.location.href,
      relevancy: similarity
    });

    console.log(`✅ [Productivity Logger] URL: ${window.location.href} | Relevancy: ${(similarity * 100).toFixed(2)}%`);
  });
})();
