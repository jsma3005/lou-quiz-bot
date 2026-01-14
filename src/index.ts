// src/index.ts
import { Bot } from 'grammy'
import { config, validateConfig } from './config'
import { handleDev, handleStart, handlePay } from './commands'
import { handlePaymentFlow } from './handlers/payment'
import { handleApprovePayment, handleRejectPayment, handleSendMessage, handleSendAll } from './handlers/admin'
import { handlePayButton } from './commands/start'
import { handleFeatures } from './commands/features'
import { handleSupport } from './commands/support'

validateConfig()

const bot = new Bot(config.BOT_TOKEN)

// Регистрируем команды
bot.command('start', handleStart)
bot.command('dev', handleDev)
bot.command('pay', handlePay)

// Обработчик для inline кнопок
bot.callbackQuery('pay_command', handlePayButton)
bot.callbackQuery('features_command', handleFeatures)
bot.callbackQuery('support_command', handleSupport)

// Команды администраторов
bot.command('approve', handleApprovePayment)
bot.command('reject', handleRejectPayment)
bot.command('send', handleSendMessage)
bot.command('sendall', handleSendAll)

// Обрабатываем сообщения для процесса оплаты
bot.on('message', handlePaymentFlow)

// Обработка ошибок
bot.catch((err) => {
  console.error('Error occurred:', err)
})

bot.start({
  onStart: (botInfo) => {
    console.log(`Bot ${botInfo.username} started!`)
  },
})