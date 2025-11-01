// plugins/aivenice.js
import axios from "axios";

export default bot => {
  bot.command("aivenice", async ctx => {
    const text = ctx.message.text.split(" ").slice(1).join(" ");
    if (!text) return ctx.replyWithMarkdownV2("```Masukkan teks setelah perintah /aivenice```");
    try {
      const res = await axios.get(`https://restapiarceus.vercel.app/ai/venice?text=${encodeURIComponent(text)}`);
      const hasil = res.data.result;
      await ctx.replyWithMarkdownV2("```" + hasil.replace(/([*_`\[\]()~>#+\-=|{}.!])/g, "\\$1") + "```");
    } catch {
      await ctx.replyWithMarkdownV2("```Terjadi kesalahan, coba lagi nanti.```");
    }
  });
};