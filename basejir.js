import fs from "fs"
import path from "path"
import { Telegraf, Markup } from "telegraf"
import { fileURLToPath } from "url"
import axios from "axios"
import { token } from "./vtoken.js"

const bot = new Telegraf(token)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginsDir = path.join(__dirname, "plugins")

fs.readdirSync(pluginsDir).forEach(file => {
  if (file.endsWith(".js")) {
    import(`./plugins/${file}`).then(plugin => plugin.default(bot))
  }
})

bot.command("router", async ctx => {
  try {
    const data = fs.readFileSync(path.join(__dirname, "router.txt"), "utf8")
    await ctx.replyWithHTML(`<blockquote>${data}</blockquote>`)
  } catch {
    await ctx.replyWithHTML("<blockquote>Router tidak ditemukan.</blockquote>")
  }
})

bot.launch().then(() => {
  console.log("Bot berjalan...")
})