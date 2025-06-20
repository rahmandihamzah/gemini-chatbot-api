const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  input.focus(); // Keep focus on the input field

  // Display a thinking message for the bot
  appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    // Remove the "thinking..." message before appending the actual response
    const thinkingMessage = chatBox.lastChild;
    if (thinkingMessage && thinkingMessage.classList.contains('bot') && thinkingMessage.textContent.includes('thinking...')) {
      chatBox.removeChild(thinkingMessage);
    }

    if (!response.ok) {
      const errorData = await response.json();
      // Check for 'replay' or 'error' field from backend, otherwise use HTTP status
      throw new Error(errorData.replay || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    appendMessage('bot', data.replay);
  } catch (error) {
    console.error('Error fetching chat response:', error);
    // If an error occurs, ensure the "thinking..." message is removed if it's still the last message
    const lastMessage = chatBox.lastChild;
    if (lastMessage && lastMessage.classList.contains('bot') && lastMessage.textContent.includes('thinking...')) {
        chatBox.removeChild(lastMessage);
    }
    appendMessage('bot', `Sorry, something went wrong: ${error.message}`);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
