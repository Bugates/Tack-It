document.getElementById('savePurpose').addEventListener('click', () => {
  const purpose = document.getElementById('purposeInput').value.trim();
  if (purpose) {
    chrome.storage.local.set({ userPurpose: purpose }, () => {
      document.getElementById('status').textContent = `✅ Purpose saved: "${purpose}"`;
    });
  } else {
    document.getElementById('status').textContent = "⚠️ Please enter a purpose.";
  }
});
