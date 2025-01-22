// src/commands/start.ts
import { CommandContext, Context } from 'grammy'
import { getStartKeyboard } from '../keyboards/start'
import { handlePay } from './pay'

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

// Создаем обработчик для кнопки оплаты
export const handlePayButton = async (ctx: Context) => {
  // Удаляем инлайн клавиатуру после нажатия
  await ctx.answerCallbackQuery()
  // Запускаем процесс оплаты
  await handlePay(ctx as CommandContext<Context>)
}