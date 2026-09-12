const N8N_CHAT_URL =
  'https://khu30.app.n8n.cloud/webhook/182add0d-decd-4869-9df1-593c029b7cfd/chat';

export async function sendMessageToN8N(
  message: string,
  sessionId: string
) {
  const response = await fetch(
    `${N8N_CHAT_URL}?action=sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId,
        chatInput: message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `n8n request failed: ${response.status}`
    );
  }

  return response;
}