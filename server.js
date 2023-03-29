const { Configuration, OpenAIApi } = require("openai");
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const client = new Client();
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    console.log(message.body);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message.body,
    },
    {
      timeout: 1000,
      headers: {
        "Example-Header": "example",
      },
    });
    let resp = completion.data.choices[0].text;
      console.log(resp);
      message.reply(resp);
     
	if(message.body === '!ping') {
		message.reply('pong');
	}
});
client.initialize();
