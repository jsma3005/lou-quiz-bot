import axios from 'axios'
import { ApiResponse, Quiz } from '../types'

const POCKETBASE_URL = 'https://lou-app.ru'

export const getAvailableQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${POCKETBASE_URL}/api/collections/quizzes/records`, {
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

// Интерфейс для студента из PocketBase
export interface Student {
  id: string
  username: string
  firstName: string
  lastName: string
  photoUrl: string
  availableQuizzes: string[]
  phoneNumber: string
  group: string
  yearOfStudy: string
  uid: string  // Telegram ID
  collectionId: string
  collectionName: string
  created: string
  updated: string
}

interface StudentsResponse {
  items: Student[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

// Получение всех студентов из PocketBase
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const allStudents: Student[] = []
    let page = 1
    let totalPages = 1

    // Получаем все страницы
    while (page <= totalPages) {
      const response = await axios.get<StudentsResponse>(
        `${POCKETBASE_URL}/api/collections/students/records`,
        {
          params: {
            sort: '-created',
            page,
            perPage: 500, // Максимум записей на страницу
          },
        }
      )

      allStudents.push(...response.data.items)
      totalPages = response.data.totalPages
      page++
    }

    return allStudents
  } catch (error) {
    console.error('Error fetching students:', error)
    return []
  }
}