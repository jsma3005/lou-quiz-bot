// src/handlers/admin.ts
import { Context } from 'grammy'
import { config } from '../config'

// Функция для проверки, является ли чат группой администраторов
const isAdminGroup = (ctx: Context): boolean => {
  return ctx.chat?.id.toString() === config.ADMIN_GROUP_ID
}

// Функция для извлечения данных пользователя из текста сообщения
const extractUserData = (text: string) => {
  // Ищем ID пользователя в тексте сообщения
  const userIdMatch = text.match(/ID пользователя: (\d+)/)
  if (!userIdMatch) return null

  // Ищем выбранные тесты
  const testsMatch = text.match(/Выбранные тесты: (.+)\n/)
  
  return {
    userId: userIdMatch[1],
    tests: testsMatch ? testsMatch[1] : 'не указаны'
  }
}

// Обработчик команды подтверждения платежа
export const handleApprovePayment = async (ctx: Context) => {
  if (!isAdminGroup(ctx)) {
    await ctx.reply('Эта команда доступна только в группе администраторов')
    return
  }

  // Проверяем, что команда была отправлена в ответ на сообщение
  if (!ctx.message?.reply_to_message?.text) {
    await ctx.reply(
      'Эта команда должна быть отправлена в ответ на сообщение о платеже'
    )
    return
  }

  const userData = extractUserData(ctx.message.reply_to_message.text)
  if (!userData) {
    await ctx.reply('Не удалось найти информацию о пользователе в сообщении')
    return
  }

  try {
    // Отправляем сообщение пользователю о подтверждении платежа
    await ctx.api.sendMessage(
      userData.userId,
      `✅ Ваш платеж подтвержден!\n\n` +
      `Вы успешно получили доступ к тестам: ${userData.tests}\n\n` +
      `Можете приступать к прохождению тестов в приложении, нажав на «Открыть приложение». Удачного прохождения тестов ✅`
    )

    // Подтверждаем в группе администраторов
    await ctx.reply(
      `✅ Платеж подтвержден\n` +
      `👤 ID пользователя: ${userData.userId}\n` +
      `📚 Тесты: ${userData.tests}`
    )
  } catch (error) {
    console.error('Error sending approval message:', error)
    await ctx.reply(
      '⚠️ Произошла ошибка при отправке подтверждения пользователю'
    )
  }
}

// Обработчик команды отклонения платежа
export const handleRejectPayment = async (ctx: Context) => {
  if (!isAdminGroup(ctx)) {
    await ctx.reply('Эта команда доступна только в группе администраторов')
    return
  }

  // Получаем причину отклонения (текст после команды)
  const reason = ctx.message?.text?.split('/reject ')[1] || 'Причина не указана'

  // Проверяем, что команда была отправлена в ответ на сообщение
  if (!ctx.message?.reply_to_message?.text) {
    await ctx.reply(
      'Эта команда должна быть отправлена в ответ на сообщение о платеже'
    )
    return
  }

  const userData = extractUserData(ctx.message.reply_to_message.text)
  if (!userData) {
    await ctx.reply('Не удалось найти информацию о пользователе в сообщении')
    return
  }

  try {
    // Отправляем сообщение пользователю об отклонении платежа
    await ctx.api.sendMessage(
      userData.userId,
      `❌ Ваш платеж не подтвержден\n\n` +
      `Причина: ${reason}\n\n` +
      `Если у вас есть вопросы, пожалуйста, свяжитесь с администратором.`
    )

    // Подтверждаем в группе администраторов
    await ctx.reply(
      `❌ Платеж отклонен\n` +
      `👤 ID пользователя: ${userData.userId}\n` +
      `📚 Тесты: ${userData.tests}\n` +
      `❗️ Причина: ${reason}`
    )
  } catch (error) {
    console.error('Error sending rejection message:', error)
    await ctx.reply(
      '⚠️ Произошла ошибка при отправке уведомления об отклонении пользователю'
    )
  }
}

// Обработчик команды отправки сообщения пользователю
export const handleSendMessage = async (ctx: Context) => {
  if (!isAdminGroup(ctx)) {
    await ctx.reply('Эта команда доступна только в группе администраторов')
    return
  }

  // Получаем текст сообщения (текст после команды)
  const messageText = ctx.message?.text?.split('/send ')[1]
  
  if (!messageText) {
    await ctx.reply(
      'Пожалуйста, укажите текст сообщения после команды /send'
    )
    return
  }

  // Проверяем, что команда была отправлена в ответ на сообщение
  if (!ctx.message?.reply_to_message?.text) {
    await ctx.reply(
      'Эта команда должна быть отправлена в ответ на сообщение о платеже'
    )
    return
  }

  const userData = extractUserData(ctx.message.reply_to_message.text)
  if (!userData) {
    await ctx.reply('Не удалось найти информацию о пользователе в сообщении')
    return
  }

  try {
    // Отправляем сообщение пользователю
    await ctx.api.sendMessage(
      userData.userId,
      messageText
    )

    // Подтверждаем в группе администраторов
    await ctx.reply(
      `✉️ Сообщение отправлено\n` +
      `👤 ID пользователя: ${userData.userId}`
    )
  } catch (error) {
    console.error('Error sending message:', error)
    await ctx.reply(
      '⚠️ Произошла ошибка при отправке сообщения пользователю'
    )
  }
}