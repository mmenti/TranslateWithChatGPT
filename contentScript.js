document.addEventListener('mouseup', async (event) => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText) {
    const popup = createPopup();
    positionPopup(event.pageX, event.pageY, popup);
    document.body.appendChild(popup);

    let popupClicked = false;

    popup.addEventListener('mousedown', async () => {
      popupClicked = true;
      document.getElementById('chatgpt-popup').textContent = 'Working...';
      chrome.runtime.sendMessage(
        { type: 'sendToChatGPT', text: selectedText },
        (response) => {
          showCustomAlert(`Response from ChatGPT: ${response}`);
          popup.remove();
        }
      );
    });

    document.addEventListener('mousedown', () => {
      if (popup && !popupClicked) {
        popup.remove();
      }
    }, { once: true });
  }
});

function showCustomAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.classList.add('chatgpt-custom-alert');
  alertBox.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.classList.add('chatgpt-close-button');
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', () => {
    alertBox.remove();
  });

  alertBox.appendChild(closeButton);
  document.body.appendChild(alertBox);
}

function insertResponseIntoPage(message) {
  const responseDiv = document.createElement('div');
  responseDiv.classList.add('chatgpt-response');
  responseDiv.textContent = message;
  document.body.appendChild(responseDiv);

  setTimeout(() => {
    responseDiv.remove();
  }, 3000);
}

// Keep the createPopup() and positionPopup(x, y, popup) functions as before

function createPopup() {
  const popup = document.createElement('div');
  popup.setAttribute('id', 'chatgpt-popup');
  popup.classList.add('chatgpt-popup');
  popup.textContent = 'Translate using ChatGPT';
  return popup;
}

function positionPopup(x, y, popup) {
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
}

