chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'sendToChatGPT') {
    sendToChatGPT(request.text).then(sendResponse);
    return true; // Required for async `sendResponse`
  }
});

function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiKey'], (result) => {
      resolve(result.apiKey || '');
    });
  });
}

function getLangTo() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['langTo'], (result) => {
      resolve(result.langTo || '');
    });
  });
}

async function sendToChatGPT(text) {
  const apiUrl = 'https://api.openai.com/v1/completions';
  const apiKey = await getApiKey();
  if (!apiKey) {
    return 'Please set your OpenAI API key in the extension settings.';
  }

  let langTo = await getLangTo();
  if (!langTo || langTo == '') {
    langTo = 'English';
  }

  const prompt = `Translate the following text into ${langTo}: "${text}"`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ 
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1000,
      n: 1,
      stop: null,
      temperature: 1,
    }),
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

