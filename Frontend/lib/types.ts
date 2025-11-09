export interface User {
  id: string
  name: string
  email: string
  upiId?: string
  avatar?: string
}

export interface Room {
  id: string
  name: string
  description?: string
  members: User[]
  createdAt: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  paidBy: User
  roomId: string
  participants: User[]
  createdAt: string
}

export interface Message {
  id: string
  content: string
  sender: User
  roomId: string
  createdAt: string
}
