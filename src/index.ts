import { Bot } from 'grammy'
import { config, validateConfig } from './config'
import { handleStart } from './commands'

// Проверяем конфигурацию
validateConfig()

// Создаем инстанс бота
const bot = new Bot(config.BOT_TOKEN)

// Регистрируем команды
bot.command('start', handleStart)

// Обработка ошибок
bot.catch((err) => {
  console.error('Error occurred:', err)
})

// Запускаем бота
bot.start({
  onStart: (botInfo) => {
    console.log(`Bot ${botInfo.username} started!`)
  },
})