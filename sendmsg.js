import axios from 'axios'; //

const botToken = process.env.CDP_TOKEN; // Replace with your Discord bot token
const SEND_TOKEN = process.env.SEND_TOKEN;

// Function to send a message to the Discord bot
export async function SendMessage(channelId, message) {
  try {
    // Make an HTTP POST request to the Discord bot API  
// https://discord.com/api/v9/channels/1213079139125436478/messages
    const response = await axios.post(`https://discord.com/api/v9/channels/${channelId}/messages`, {
      content: message,
    }, {
      headers: {
        'Authorization': SEND_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    // Wait for the bot's response 
    const messageId = response.data.id;
    console.log('messageid:' +messageId)
    const responseUrl = `https://discord.com/api/channels/${channelId}/messages/${messageId}`;
    const botResponse = await axios.get(responseUrl, {
      headers: {
        'Authorization': 'Bot ' + botToken,
      },
    });

    // Log the bot's response
    console.log(botResponse.data.content);
    return botResponse.data.content
  } catch (error) {
    console.error(error);
  }
}

// Usage: sendMessageToBot('YOUR_CHANNEL_ID', 'Hello, bot!');