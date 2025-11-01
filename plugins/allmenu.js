// plugins/allmenu.js
import { Markup } from "telegraf";

export default (bot) => {
  bot.command("menu", async (ctx) => {
    const videoUrl = "https://v16-coin.tiktokcdn.com/ce1e63cabc737b609dec8ec492b2c0d1/6904ee1f/video/tos/alisg/tos-alisg-pve-0037/osPiaQAYBTiPAF3hEzlIED68AWPqU9QOR7OVc/?a=0&bti=OUBzOTg7QGo6OjZAL3AjLTAzYCMxNDNg&ch=0&cr=13";
    const caption = "```ᴍᴇɴᴜ ʙᴏᴛ\nᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ʏᴀɴɢ ɪɴɢɪɴ ᴋᴀᴍᴜ ɢᴜɴᴀᴋᴀɴ```";
    const buttons = Markup.inlineKeyboard([
      [
        Markup.button.callback("ᴀɪ ᴍᴇɴᴜ", "ai_menu"),
        Markup.button.callback("ᴛᴏᴏʟꜱ ᴍᴇɴᴜ", "tools_menu")
      ]
    ]);

    await ctx.replyWithVideo(videoUrl, {
      caption,
      parse_mode: "Markdown",
      reply_markup: buttons.reply_markup
    });
  });

  bot.action("ai_menu", async (ctx) => {
    await ctx.answerCbQuery();
    const buttons = Markup.inlineKeyboard([
      [Markup.button.callback("ʙᴀᴄᴋ", "back_menu")]
    ]);
    await ctx.editMessageCaption("```ᴀɪ ᴍᴇɴᴜ\n/ᴀɪɢᴇᴍɪɴɪ\n/ᴀɪᴠᴇɴɪᴄᴇ```", {
      parse_mode: "Markdown",
      reply_markup: buttons.reply_markup
    });
  });

  bot.action("tools_menu", async (ctx) => {
    await ctx.answerCbQuery();
    const buttons = Markup.inlineKeyboard([
      [Markup.button.callback("ʙᴀᴄᴋ", "back_menu")]
    ]);
    await ctx.editMessageCaption("```ᴛᴏᴏʟꜱ ᴍᴇɴᴜ\n/ᴀᴅᴅꜰɪᴛᴜʀ```", {
      parse_mode: "Markdown",
      reply_markup: buttons.reply_markup
    });
  });

  bot.action("back_menu", async (ctx) => {
    await ctx.answerCbQuery();
    const caption = "```ᴍᴇɴᴜ ʙᴏᴛ\nᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ʏᴀɴɢ ɪɴɢɪɴ ᴋᴀᴍᴜ ɢᴜɴᴀᴋᴀɴ```";
    const buttons = Markup.inlineKeyboard([
      [
        Markup.button.callback("ᴀɪ ᴍᴇɴᴜ", "ai_menu"),
        Markup.button.callback("ᴛᴏᴏʟꜱ ᴍᴇɴᴜ", "tools_menu")
      ]
    ]);
    await ctx.editMessageCaption(caption, {
      parse_mode: "Markdown",
      reply_markup: buttons.reply_markup
    });
  });
};