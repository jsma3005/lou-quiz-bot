import { CommandContext, Context } from 'grammy'
import { getTestWebAppKeyboard } from '../keyboards/testwebapp'

export const handleDev = async (ctx: CommandContext<Context>) => {
  await ctx.reply('Тестовый режим приложения', {
    reply_markup: getTestWebAppKeyboard(),
  })
}