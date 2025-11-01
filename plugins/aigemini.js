// plugins/aigemini.js
import axios from "axios";

export default (bot) => {
  bot.command("aigemini", async (ctx) => {
    const text = ctx.message.text.split(" ").slice(1).join(" ");
    if (!text) return ctx.replyWithHTML("<blockquote>Masukkan teks setelah perintah /aigemini</blockquote>");
    const prompt = "Kamu adalah gadis anime yang imut, lembut, dan ramah. Jawablah pesan berikut dengan gaya anime cewek yang ceria dan sopan: " + text;
    try {
      const url = "https://restapiarceus.vercel.app/ai/gemini?ask=" + encodeURIComponent(prompt);
      const res = await axios.get(url);
      const hasil = res.data.result;
      await ctx.replyWithHTML("<blockquote>" + hasil + "</blockquote>");
    } catch (e) {
      await ctx.replyWithHTML("<blockquote>Terjadi kesalahan, coba lagi nanti.</blockquote>");
    }
  });
};