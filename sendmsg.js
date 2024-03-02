import axios from 'axios'; //

/** the botResponse.data: 
 * [
  {
    "id": "1213470937442422784",
    "type": 19,
    "content": "Hello! How may I assist you today?",
    "channel_id": "1213079139125436478",
    "author": {
      "id": "1213079802731438140",
      "username": "coze-bot",
      "avatar": "c62412282dc00e79f987c6bb5e0f259e",
      "discriminator": "5251",
      "public_flags": 524288,
      "premium_type": 0,
      "flags": 524288,
      "bot": true,
      "banner": null,
      "accent_color": null,
      "global_name": null,
      "avatar_decoration_data": null,
      "banner_color": null
    },
    "attachments": [],
    "embeds": [],
    "mentions": [
      {
        "id": "864713105141006369",
        "username": "bilbo2032",
        "avatar": null,
        "discriminator": "0",
        "public_flags": 0,
        "premium_type": 0,
        "flags": 0,
        "banner": null,
        "accent_color": null,
        "global_name": "NeoEthan",
        "avatar_decoration_data": null,
        "banner_color": null
      }
    ],
    "mention_roles": [],
    "pinned": false,
    "mention_everyone": false,
    "tts": false,
    "timestamp": "2024-03-02T13:00:16.686000+00:00",
    "edited_timestamp": "2024-03-02T13:00:17.972000+00:00",
    "flags": 0,
    "components": [],
    "message_reference": {
      "channel_id": "1213079139125436478",
      "message_id": "1213470921483100170",
      "guild_id": "864713710937309184"
    },
    "referenced_message": {
      "id": "1213470921483100170",
      "type": 0,
      "content": "<@1213079802731438140> hello",
      "channel_id": "1213079139125436478",
      "author": {
        "id": "864713105141006369",
        "username": "bilbo2032",
        "avatar": null,
        "discriminator": "0",
        "public_flags": 0,
        "premium_type": 0,
        "flags": 0,
        "banner": null,
        "accent_color": null,
        "global_name": "NeoEthan",
        "avatar_decoration_data": null,
        "banner_color": null
      },
      "attachments": [],
      "embeds": [],
      "mentions": [
        {
          "id": "1213079802731438140",
          "username": "coze-bot",
          "avatar": "c62412282dc00e79f987c6bb5e0f259e",
          "discriminator": "5251",
          "public_flags": 524288,
          "premium_type": 0,
          "flags": 524288,
          "bot": true,
          "banner": null,
          "accent_color": null,
          "global_name": null,
          "avatar_decoration_data": null,
          "banner_color": null
        }
      ],
      "mention_roles": [],
      "pinned": false,
      "mention_everyone": false,
      "tts": false,
      "timestamp": "2024-03-02T13:00:12.881000+00:00",
      "edited_timestamp": null,
      "flags": 0,
      "components": []
    }
  }
]
 */

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
    console.log('messageId:', messageId);

    const responseUrl = `https://discord.com/api/v9/channels/${channelId}/messages?after=${messageId}`;
    let botResponse;
    let i = 20;
    while (i-- > 0) {
      botResponse = await axios.get(responseUrl, {
        headers: {
          'Authorization': 'Bot ' + botToken,
        },
      });
      for (const message of botResponse.data) {
        if (message.referenced_message && message.referenced_message.id === messageId) {
          console.log('message response:',JSON.stringify(message, null, 2));
        }
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    console.log("end-----")
  } catch (error) {
    console.error(error);
  }
}