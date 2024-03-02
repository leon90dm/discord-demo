import axios from 'axios'; //

const botToken = process.env.DISCORD_TOKEN; // Replace with your Discord bot token

export const SendMessage = async (recipientId, content) => {
  try {
    // Send a message to the bot
    const response = await axios.post(
      `https://discord.com/api/v10/users/@me/channels`,
      {
        recipients: [recipientId],
      },
      {
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const channelId = response.data.id;

    // Send a message to the bot's DM channel
    await axios.post(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        content: content,
      },
      {
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Wait for the bot's response (optional)
    const responseMessage = await waitForBotResponse(channelId);
    console.log('Bot response:', responseMessage);
    return responseMessage;
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const waitForBotResponse = async (channelId) => {
  try {
    // Continuously check for new messages in the channel
    while (true) {
      const response = await axios.get(
        `https://discord.com/api/v10/channels/${channelId}/messages`,
        {
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Check if the bot has responded
      const message = response.data.find((msg) => msg.author.bot);
      if (message) {
        return message.content;
      }

      // Wait for a short interval before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error waiting for bot response:', error);
  }
};