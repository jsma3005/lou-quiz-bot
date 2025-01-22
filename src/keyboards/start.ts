import { InlineKeyboard } from 'grammy'
import { config } from '../config'

export const getStartKeyboard = () => {
  return new InlineKeyboard()
    .webApp('📝 Начни проходить тесты', config.WEBAPP_URL)  // Карандаш/заметки для тестов
    .row()
    .text('💳 Получить доступ к тестам', 'pay_command')     // Карточка для оплаты
    .row()
    .text('ℹ️ Что я получаю, открыв доступ к тестам?', 'features_command')  // Информация для преимуществ
    .row()
    .text('👨‍💻 Обратиться в службу поддержки', 'support_command')  // Человек за компьютером для поддержки
}