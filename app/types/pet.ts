export interface Pet {
  id: string
  user_id: string
  name: string
  species: 'cat' | 'dog' | 'other'
  breed?: string
  birthday?: string
  gender?: 'male' | 'female' | 'unknown'
  avatar_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface HealthRecord {
  id: string
  pet_id: string
  date: string
  type: 'vaccine' | 'deworming' | 'checkup' | 'illness' | 'other'
  title: string
  note?: string
  next_due_date?: string
  created_at: string
}

export type NewPet = Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type NewHealthRecord = Omit<HealthRecord, 'id' | 'created_at'>
