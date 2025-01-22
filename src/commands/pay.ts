// src/commands/pay.ts
import { CommandContext, Context } from 'grammy'
import { getConversationState, updateConversationState } from '../conversation'
import { getPaymentKeyboard } from '../keyboards/payment'

export const handlePay = async (ctx: CommandContext<Context>) => {
  const userId = ctx.from?.id
  if (!userId) return

  updateConversationState(userId, {
    step: 'awaiting_fullname',
    paymentData: {
      userId,
      username: ctx.from?.username,
      timestamp: new Date()
    }
  })

  await ctx.reply(
    'Добро пожаловать в систему оплаты тестов Lou Quiz!\n\n' +
    'Стоимость одного теста: 50 сом\n' +
    'Для начала процесса оплаты, пожалуйста, нажмите "Отправить ФИО"',
    {
      reply_markup: getPaymentKeyboard()
    }
  )
}