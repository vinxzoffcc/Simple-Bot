// plugins/backup.js
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import archiver from "archiver";
import { Markup } from "telegraf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_ID = 7808981311n;

export default (bot) => {
  bot.command("backup", async (ctx) => {
    try {
      const fromId = BigInt(ctx.from?.id || 0);
      if (fromId !== AUTH_ID) {
        await ctx.reply("Access denied.");
        return;
      }

      const root = process.cwd();
      const filesToInclude = [
        path.join(root, "vtoken.js"),
        path.join(root, "basejir.js"),
        path.join(root, "package.json"),
      ];

      const pluginsDir = path.join(root, "plugins");
      if (fs.existsSync(pluginsDir)) {
        const pluginFiles = fs.readdirSync(pluginsDir).map((f) => path.join(pluginsDir, f));
        for (const p of pluginFiles) {
          filesToInclude.push(p);
        }
      }

      const timestamp = Date.now();
      const zipName = `backup_${timestamp}.zip`;
      const tmpDir = os.tmpdir();
      const zipPath = path.join(tmpDir, zipName);

      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      const infoList = [];

      output.on("close", async () => {
        const zipStat = fs.statSync(zipPath);
        const human = (n) => {
          if (n < 1024) return `${n} B`;
          if (n < 1024 ** 2) return `${(n / 1024).toFixed(2)} KiB`;
          if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(2)} MiB`;
          return `${(n / 1024 ** 3).toFixed(2)} GiB`;
        };

        let report = "```Backup Report\n";
        for (const it of infoList) {
          report += `${it.rel} — ${human(it.size)}\n`;
        }
        report += `\nArchive: ${zipName} — ${human(zipStat.size)}\n`;
        report += `Path: ${zipPath}\n`;
        report += "```";

        try {
          await ctx.reply(report, { parse_mode: "Markdown" });
          await ctx.replyWithDocument({ source: fs.createReadStream(zipPath), filename: zipName });
        } catch (e) {
          await ctx.reply("Failed to send backup file.");
        } finally {
          try { fs.unlinkSync(zipPath); } catch {}
        }
      });

      archive.on("warning", (err) => {});
      archive.on("error", (err) => { throw err; });

      archive.pipe(output);

      for (const filePath of filesToInclude) {
        if (!fs.existsSync(filePath)) continue;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          const rel = path.relative(root, filePath) || path.basename(filePath);
          archive.directory(filePath, rel);
          const dirFiles = [];
          const walk = (dir) => {
            for (const name of fs.readdirSync(dir)) {
              const p = path.join(dir, name);
              const st = fs.statSync(p);
              if (st.isDirectory()) walk(p);
              else dirFiles.push({ p, rel: path.relative(root, p), size: st.size });
            }
          };
          walk(filePath);
          for (const df of dirFiles) infoList.push({ rel: df.rel, size: df.size });
        } else {
          const rel = path.relative(root, filePath) || path.basename(filePath);
          archive.file(filePath, { name: rel });
          infoList.push({ rel, size: stat.size });
        }
      }

      await archive.finalize();
    } catch (e) {
      try { await ctx.reply("Backup failed."); } catch {}
    }
  });

  bot.action("backup_info", async (ctx) => {
    try {
      const fromId = BigInt(ctx.from?.id || 0);
      if (fromId !== AUTH_ID) {
        await ctx.answerCbQuery("Access denied.", { show_alert: true });
        return;
      }
      await ctx.answerCbQuery("Use /backup to create a fresh backup.");
    } catch {}
  });

  bot.command("backupstatus", async (ctx) => {
    try {
      const fromId = BigInt(ctx.from?.id || 0);
      if (fromId !== AUTH_ID) {
        await ctx.reply("Access denied.");
        return;
      }
      const root = process.cwd();
      const targets = [
        { p: path.join(root, "vtoken.js") },
        { p: path.join(root, "basejir.js") },
        { p: path.join(root, "package.json") },
        { p: path.join(root, "plugins") },
      ];
      const human = (n) => {
        if (n < 1024) return `${n} B`;
        if (n < 1024 ** 2) return `${(n / 1024).toFixed(2)} KiB`;
        if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(2)} MiB`;
        return `${(n / 1024 ** 3).toFixed(2)} GiB`;
      };
      let msg = "```Backup Status\n";
      for (const t of targets) {
        if (!fs.existsSync(t.p)) {
          msg += `${path.relative(root, t.p) || path.basename(t.p)} — MISSING\n`;
          continue;
        }
        const st = fs.statSync(t.p);
        if (st.isDirectory()) {
          const list = [];
          const walk = (dir) => {
            for (const name of fs.readdirSync(dir)) {
              const p = path.join(dir, name);
              const s = fs.statSync(p);
              if (s.isDirectory()) walk(p);
              else list.push(s.size);
            }
          };
          walk(t.p);
          const total = list.reduce((a, b) => a + b, 0);
          msg += `${path.relative(root, t.p) || path.basename(t.p)} — dir — ${human(total)} (${list.length} files)\n`;
        } else {
          msg += `${path.relative(root, t.p) || path.basename(t.p)} — ${human(st.size)}\n`;
        }
      }
      msg += "```";
      await ctx.reply(msg, { parse_mode: "Markdown" });
    } catch {
      await ctx.reply("Failed to get status.");
    }
  });
};