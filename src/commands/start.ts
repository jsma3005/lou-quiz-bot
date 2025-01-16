import { CommandContext, Context } from 'grammy'
import { getWebAppKeyboard } from '../keyboards/webapp'

export const handleStart = async (ctx: CommandContext<Context>) => {
  await ctx.reply('Добро пожаловать! Нажмите на кнопку, чтобы открыть приложение', {
    reply_markup: getWebAppKeyboard(),
  })
}