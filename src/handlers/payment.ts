// src/handlers/payment.ts
import { Context } from 'grammy'
import { getConversationState, updateConversationState, resetConversation } from '../conversation'
import { config } from '../config'
import { getPaymentKeyboard, getCancelConfirmationKeyboard } from '../keyboards/payment'

// src/handlers/payment.ts
export const handlePaymentFlow = async (ctx: Context) => {
  const userId = ctx.from?.id
  if (!userId) return

  const state = getConversationState(userId)
  const messageText = ctx.message?.text

  // Обработчик отмены остается без изменений
  if (messageText === 'Отменить') {
    await ctx.reply(
      'Вы уверены, что хотите отменить оплату?',
      { reply_markup: getCancelConfirmationKeyboard() }
    )
    return
  }

  // Обработчик подтверждения отмены остается без изменений
  if (messageText === 'Да, отменить') {
    resetConversation(userId)
    await ctx.reply(
      'Процесс оплаты отменен. Вы можете начать заново командой /pay',
      { reply_markup: { remove_keyboard: true } }
    )
    return
  }

  if (messageText === 'Нет, продолжить') {
    switch (state.step) {
      case 'awaiting_fullname':
        await ctx.reply(
          'Пожалуйста, введите ваше ФИО:',
          { reply_markup: getPaymentKeyboard() }
        )
        break
      case 'awaiting_course':
        await ctx.reply(
          'Укажите курс и группу:\n' +
          'Например: 2 курс, группа ИВТ-1-21',
          { reply_markup: { remove_keyboard: true } }
        )
        break
      case 'awaiting_test':
        await ctx.reply(
          'Введите название(-я) теста(-ов), которые хотите получить:\n' +
          'Например: Тест по математике, Тест по физике',
          { reply_markup: { remove_keyboard: true } }
        )
        break
      case 'awaiting_screenshot':
        await ctx.reply(
          'Пожалуйста, отправьте скриншот подтверждения оплаты'
        )
        break
    }
    return
  }

  switch (state.step) {
    case 'awaiting_fullname':
      if (messageText === 'Отправить ФИО') {
        await ctx.reply(
          'Пожалуйста, введите ваше ФИО:',
          { reply_markup: { remove_keyboard: true } }
        )
      } else if (messageText && messageText !== 'Отправить ФИО') {
        updateConversationState(userId, {
          step: 'awaiting_course', // Меняем следующий шаг на ввод курса
          paymentData: {
            ...state.paymentData,
            fullName: messageText
          }
        })
        // Запрашиваем информацию о курсе
        await ctx.reply(
          'Укажите курс и группу:\n' +
          'Например: 2 курс, группа ИВТ-1-21',
          { reply_markup: { remove_keyboard: true } }
        )
      }
      break

    case 'awaiting_course':
      if (messageText) {
        updateConversationState(userId, {
          step: 'awaiting_test',
          paymentData: {
            ...state.paymentData,
            courseInfo: messageText
          }
        })
        // После получения информации о курсе запрашиваем тесты
        await ctx.reply(
          'Введите название(-я) теста(-ов), которые хотите получить:\n' +
          'Например: Тест по математике, Тест по физике\n\n' +
          '💰 Стоимость одного теста: 70 сом',
          { reply_markup: { remove_keyboard: true } }
        )
      }
      break

    case 'awaiting_test':
      if (messageText) {
        updateConversationState(userId, {
          step: 'awaiting_screenshot',
          paymentData: {
            ...state.paymentData,
            testId: messageText
          }
        })

        await ctx.reply(
          `Отлично! ` +
          `Общая стоимость будет равна: количество тестов * 70 сом\n\n` +
          'Реквизиты для оплаты:\n' +
          '• Mbank: 774 100 161 ( Урмат С. )\n' +
          '• Optima: 774 100 161 ( Урмат С. ) \n\n' +
          'После оплаты сделайте скриншот и отправьте его сюда.',
          { reply_markup: { remove_keyboard: true } }
        )
      }
      break

    case 'awaiting_screenshot':
      // Проверяем тип входящего сообщения
      if (!ctx.message) return;

      // Если пришло что-то кроме фото
      if (!ctx.message.photo) {
        let errorMessage = '❌ Пожалуйста, отправьте скриншот подтверждения оплаты в виде фотографии.\n\n';

        // Делаем специфичные подсказки в зависимости от типа полученного сообщения
        if (ctx.message.text) {
          errorMessage += 'Вы отправили текстовое сообщение, но нам нужен именно скриншот.\n';
        } else if (ctx.message.document) {
          errorMessage += 'Вы отправили файл. Пожалуйста, отправьте изображение без сжатия (не как файл).\n';
        } else if (ctx.message.video) {
          errorMessage += 'Вы отправили видео. Пожалуйста, отправьте скриншот в виде фотографии.\n';
        } else if (ctx.message.sticker) {
          errorMessage += 'Вы отправили стикер. Пожалуйста, отправьте скриншот в виде фотографии.\n';
        }

        errorMessage += '\nКак сделать скриншот:\n' +
          '1. Сделайте снимок экрана с подтверждением оплаты\n' +
          '2. Выберите этот скриншот из галереи\n' +
          '3. Отправьте его как фотографию (не как файл)\n\n' +
          'Реквизиты для оплаты:\n' +
          '• Mbank: 774 100 161 ( Урмат С. )\n' +
          '• Optima: 774 100 161 ( Урмат С. )';

        await ctx.reply(errorMessage);
        return;
      }

      // Если получили фото, продолжаем обработку как раньше
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      const paymentData = {
        ...state.paymentData,
        screenshotFileId: fileId,
        status: 'pending'
      };

      try {
        // Отправляем информацию администраторам
        await ctx.api.sendMessage(
          config.ADMIN_GROUP_ID,
          `🆕 Новая заявка на оплату\n\n` +
          `👤 ФИО: ${paymentData.fullName}\n` +
          `👨‍🎓 Курс/группа: ${paymentData.courseInfo}\n` +
          `📚 Выбранные тесты: ${paymentData.testId}\n` +
          `🔗 Username: ${paymentData.username ? '@' + paymentData.username : 'не указан'}\n` +
          `🆔 ID пользователя: ${paymentData.userId}\n\n` +
          `Скриншот оплаты ⬇️`
        );
        await ctx.api.sendPhoto(config.ADMIN_GROUP_ID, fileId);

        resetConversation(userId);
        await ctx.reply(
          '✅ Спасибо! Ваша заявка на оплату отправлена на проверку.\n\n' +
          'Мы уведомим вас о результатах проверки в ближайшее время.',
          { reply_markup: { remove_keyboard: true } }
        );
      } catch (error) {
        console.error('Error sending payment data:', error);
        await ctx.reply(
          '⚠️ Произошла ошибка при обработке вашей заявки.\n' +
          'Пожалуйста, попробуйте еще раз или свяжитесь с администратором.',
          { reply_markup: { remove_keyboard: true } }
        );
      }
      break;
  }
}