import axios from 'axios'
import { ApiResponse, Quiz } from '../types'

export const getAvailableQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await axios.get<ApiResponse>('https://lou-app.ru/api/collections/quizzes/records', {
      params: {
        sort: '-created',
      },
    })

    return response.data.items
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return []
  }
}