// plugins/addfitur.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (bot) => {
  bot.command("addfitur", async (ctx) => {
    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.text)
      return ctx.replyWithMarkdownV2("```Balas kode plugin dengan perintah /addfitur namafile.js```");
    const args = ctx.message.text.split(" ").slice(1);
    const namaFile = args[0];
    if (!namaFile || !namaFile.endsWith(".js"))
      return ctx.replyWithMarkdownV2("```Gunakan format /addfitur namafile.js```");
    const kode = ctx.message.reply_to_message.text;
    const pluginDir = path.join(__dirname);
    const filePath = path.join(pluginDir, namaFile);
    try {
      fs.writeFileSync(filePath, kode);
      const aman = namaFile.replace(/([\\*_`\[\]()~>#+=|{}.!-])/g, "\\$1");
      await ctx.replyWithMarkdownV2("```Fitur " + aman + " berhasil disimpan, reload bot...```");
      setTimeout(() => {
        spawn("node", ["basejir.js"], {
          stdio: "inherit",
          detached: true
        });
        process.exit(0);
      }, 1000);
    } catch {
      await ctx.replyWithMarkdownV2("```Gagal menyimpan fitur```");
    }
  });
};