export interface BotConfig {
  BOT_TOKEN: string
  WEBAPP_URL: string
  DEVAPP_URL: string
  ADMIN_GROUP_ID: string
}

export interface PaymentData {
  userId: number
  username: string
  fullName: string
  courseInfo: string  // Добавляем поле для информации о курсе
  testId: string
  screenshotFileId: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp: Date
}

export interface ConversationState {
  step: 'idle' | 'awaiting_fullname' | 'awaiting_course' | 'awaiting_test' | 'awaiting_screenshot'
  paymentData: Partial<PaymentData>
}
