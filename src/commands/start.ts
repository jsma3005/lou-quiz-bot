// src/commands/start.ts
import { CommandContext, Context, InlineKeyboard } from 'grammy'
import { getStartKeyboard } from '../keyboards/start'
import { config } from '../config'

export const handleStart = async (ctx: CommandContext<Context>) => {
  await ctx.reply(
    'Добро пожаловать в Lou Quiz! 👋\n\n' +
    'Здесь вы можете:\n' +
    '• Проходить тесты для подготовки к экзаменам 📚\n' +
    '• Получать мгновенные результаты ✅\n' +
    '• Отслеживать свой прогресс 📊\n\n' +
    'Выберите действие:',
    {
      reply_markup: getStartKeyboard(),
    }
  )
}

// Обработчик для кнопки получения доступа к тестам
export const handlePayButton = async (ctx: Context) => {
  await ctx.answerCallbackQuery()
  
  const keyboard = new InlineKeyboard()
    .webApp('🚀 Запустить приложение', config.WEBAPP_URL)
  
  await ctx.reply(
    'Для получения доступа и прохождения тестов, запустите приложение и на главной странице нажмите на кнопку "Получение доступа к тесту"',
    {
      reply_markup: keyboard,
    }
  )
}