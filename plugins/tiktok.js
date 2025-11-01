// plugins/tiktok.js
import axios from "axios";

export default (bot) => {
  bot.command("tiktok", async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1).join(" ");
    if (!args) return ctx.reply("Kirim link tiktoknya!\nContoh: /tiktok https://vt.tiktok.com/xxxxx/");
    try {
      const api = `https://restapiarceus.vercel.app/download/tiktok?url=${encodeURIComponent(args)}`;
      const res = await axios.get(api);
      const data = res.data;
      if (!data.status) return ctx.reply("Gagal mengambil video.");
      const teks = `
<blockquote>
╭─⪩⧼ 𝐓𝐈𝐊𝐓𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 ⧽⪨
│  ├── Creator: ${data.creator}
│  ├── Deskripsi: ${data.result.description || "-"}
╰────────────────⧽⪨
</blockquote>`;
      await ctx.replyWithHTML(teks);
      await ctx.replyWithVideo({ url: data.result.video_nowm });
      await ctx.replyWithAudio({ url: data.result.audio_url });
    } catch {
      await ctx.reply("Terjadi kesalahan, coba lagi nanti.");
    }
  });
};