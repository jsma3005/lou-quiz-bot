// src/conversation/index.ts
import { Context } from 'grammy'
import { ConversationState } from '../types'

const conversations = new Map<number, ConversationState>()

export const getConversationState = (userId: number): ConversationState => {
  if (!conversations.has(userId)) {
    conversations.set(userId, {
      step: 'idle',
      paymentData: {}
    })
  }
  return conversations.get(userId)!
}

export const updateConversationState = (
  userId: number, 
  updates: Partial<ConversationState>
) => {
  const currentState = getConversationState(userId)
  conversations.set(userId, { ...currentState, ...updates })
}

export const resetConversation = (userId: number) => {
  conversations.set(userId, {
    step: 'idle',
    paymentData: {}
  })
}