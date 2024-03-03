var axios = require('axios'); 

const botToken = process.env.CDP_TOKEN; // Replace with your Discord bot token
const SEND_TOKEN = process.env.SEND_TOKEN;

// Function to send a message to the Discord bot
async function SendMessage(channelId, message) {
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

        let botResponse;
        let i = 20;
        while (i-- > 0) {
            const responseUrl = `https://discord.com/api/v9/channels/${channelId}/messages?after=${messageId}`;
            botResponse = await axios.get(responseUrl, {
                headers: {
                    'Authorization': 'Bot ' + botToken,
                },
            });
            for (const message of botResponse.data) {
                if (message.referenced_message && message.referenced_message.id === messageId) {
                    //log(message.content);
                    console.log(message.id,":",":",message.components.length,"->",message.content);
                    if (message.components && message.components.length > 0) {
                        return message.content;
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        console.log("end----")
    } catch (error) {
        console.error(error);
    }
}