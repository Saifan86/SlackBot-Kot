require('dotenv').config();
const { App } = require('@slack/bolt');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// helper function to ask Gemini
async function ask(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ✅ Ping
app.command('/kot-ping', async ({ command, ack, say }) => {
  await ack();
  await say(`🏓 Pong! KOT is alive, <@${command.user_id}>!`);
});

// 👋 Hello
app.command('/kot-hello', async ({ command, ack, say }) => {
  await ack();
  await say(`👑 Greetings peasant <@${command.user_id}>! KOT is here!`);
});

// 🔥 AI Roast
app.command('/kot-roast', async ({ command, ack, say }) => {
  await ack();
  const target = command.text || `<@${command.user_id}>`;
  const text = await ask(`You are KOT, the King Of Bots. Roast "${target}" in a funny royal medieval style. Keep it short, funny, not mean.`);
  await say(`👑 *KOT decrees:* ${text}`);
});

// 📜 Royal Decree
app.command('/kot-decree', async ({ command, ack, say }) => {
  await ack();
  const text = await ask(`You are KOT, King Of Bots. Make a random funny royal decree about coding or tech. Keep it short and dramatic.`);
  await say(`📜 *Royal Decree from KOT:* ${text}`);
});

// 💡 Project Idea
app.command('/kot-idea', async ({ command, ack, say }) => {
  await ack();
  const text = await ask(`Generate one unique, creative, beginner-friendly coding project idea for a teen. Be specific and exciting!`);
  await say(`💡 *KOT's Project Idea for <@${command.user_id}>:* ${text}`);
});

// 🔥 Motivate
app.command('/kot-motivate', async ({ command, ack, say }) => {
  await ack();
  const text = await ask(`You are KOT, King Of Bots. Give a short hype royal motivational message to a teen coder who is stuck. Be energetic!`);
  await say(`⚡ *KOT motivates <@${command.user_id}>:* ${text}`);
});

// 📢 Standup
app.command('/kot-standup', async ({ command, ack, say }) => {
  await ack();
  await say(`📢 *<@${command.user_id}>'s standup:*\n>${command.text || 'Nothing shared yet!'}`);
});

// 👑 Crown
app.command('/kot-crown', async ({ command, ack, say }) => {
  await ack();
  const target = command.text || `<@${command.user_id}>`;
  await say(`👑 *KOT hereby crowns ${target} as the Coder of the Day!* All shall bow! 🫡`);
});

// 📊 Poll
app.command('/kot-poll', async ({ command, ack, say }) => {
  await ack();
  if (!command.text) {
    await say('Usage: `/kot-poll your question here`');
    return;
  }
  await say(`📊 *Poll by <@${command.user_id}>:*\n*${command.text}*\n\n👍 Yes  |  👎 No  |  🤷 Maybe`);
});

// ⚔️ Duel
app.command('/kot-duel', async ({ command, ack, say }) => {
  await ack();
  const target = command.text || 'someone';
  const text = await ask(`You are KOT, King Of Bots. <@${command.user_id}> has challenged ${target} to a coding duel! Announce it dramatically in royal medieval style with a random coding challenge. Keep it fun and short.`);
  await say(`⚔️ ${text}`);
});

(async () => {
  await app.start();
  console.log('👑 KOT Bot is running!');
})();