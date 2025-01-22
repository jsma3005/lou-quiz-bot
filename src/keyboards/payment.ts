// src/keyboards/payment.ts
import { Keyboard } from 'grammy'

// Создаем основную клавиатуру для выбора действий при оплате
export const getPaymentKeyboard = () => {
  return new Keyboard()
    .text('Отправить ФИО')
    .text('Отменить')
    .resized()
    .oneTime()
}

// Клавиатура для подтверждения отмены
export const getCancelConfirmationKeyboard = () => {
  return new Keyboard()
    .text('Да, отменить')
    .text('Нет, продолжить')
    .resized()
    .oneTime()
}