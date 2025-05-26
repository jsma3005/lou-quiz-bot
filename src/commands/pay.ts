import { CommandContext, Context } from 'grammy'
import { updateConversationState } from '../conversation'
import { getPaymentKeyboard } from '../keyboards/payment'
import { getAvailableQuizzes } from '../services/api'
import { Quiz } from '../types'

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

  try {
    // Получаем список тестов и сортируем их по дате создания
    const quizzes = await getAvailableQuizzes()
    
    // Группируем тесты по курсам, сохраняя порядок сортировки по дате создания
    const quizzesByCourse = quizzes.reduce((acc, quiz) => {
      if (!acc[quiz.course]) {
        acc[quiz.course] = []
      }
      acc[quiz.course].push(quiz)
      return acc
    }, {} as Record<number, Quiz[]>)

    // Получаем отсортированный список курсов (от старших к младшим)
    const sortedCourses = Object.keys(quizzesByCourse)
      .map(Number)
      .sort((a, b) => b - a)

    const quizzesList = sortedCourses.map(course => {
      const courseQuizzes = quizzesByCourse[course]
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .map((quiz, index) => {
          const questionCount = quiz.questions.length
          
          return `${index + 1}. ${quiz.title}. Вопросы: ${questionCount}. Дисциплина: ${quiz.discipline}`
        })
        .join('\n')

      // Добавляем заголовок для каждого курса с количеством доступных тестов
      const testCount = quizzesByCourse[course].length
      const testWord = testCount === 1 ? 'тест' : 'тестов'
      return `📚 ${course} курс (${testCount} ${testWord})\n${courseQuizzes}`
    }).join('\n\n')

    // Формируем итоговое сообщение
    const messageText = quizzes.length > 0
      ? 'Добро пожаловать в систему оплаты тестов Lou Quiz!\n\n' +
        '📋 Доступные тесты:\n\n' +
        `${quizzesList}\n\n` +
        '💰 Стоимость одного теста: 70 сом\n\n' +
        '💡 Тесты отсортированы по дате добавления (новые сверху)\n' +
        '🆕 - тесты, добавленные за последнюю неделю\n\n' +
        '👉 Для начала процесса оплаты, пожалуйста, нажмите "Отправить ФИО"'
      : 'Добро пожаловать в систему оплаты тестов Lou Quiz!\n\n' +
        '⚠️ В данный момент нет доступных тестов.\n' +
        'Пожалуйста, попробуйте позже.\n\n' +
        '💰 Стоимость одного теста: 70 сом\n\n' +
        '👉 Для начала процесса оплаты, пожалуйста, нажмите "Отправить ФИО"'

    await ctx.reply(messageText, {
      reply_markup: getPaymentKeyboard(),
      parse_mode: 'Markdown'
    })
  } catch (error) {
    console.error('Error in handlePay:', error)
    await ctx.reply(
      'Добро пожаловать в систему оплаты тестов Lou Quiz!\n\n' +
      '⚠️ Не удалось загрузить список доступных тестов.\n' +
      'Пожалуйста, обратитесь в поддержку или попробуйте позже.\n\n' +
      '💰 Стоимость одного теста: 70 сом\n\n' +
      '👉 Для начала процесса оплаты, пожалуйста, нажмите "Отправить ФИО"',
      {
        reply_markup: getPaymentKeyboard(),
        parse_mode: 'Markdown'
      }
    )
  }
}