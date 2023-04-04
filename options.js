document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const langToInput = document.getElementById('langTo');
  const settingsForm = document.getElementById('settingsForm');

  // Load stored API key
  chrome.storage.sync.get(['apiKey'], (result) => {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });
  chrome.storage.sync.get(['langTo'], (result) => {
    if (result.langTo) {
      langtoInput.value = result.langTo;
    }
  });

  // Save API key on form submission
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    chrome.storage.sync.set({ apiKey: apiKeyInput.value, langTo: langToInput.value }, () => {
      alert('Settings saved');
    });
  });
});

