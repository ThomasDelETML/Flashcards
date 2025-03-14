import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Carte extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare question: string | null

  @column()
  declare response: string | null

  @column()
  declare deck_id: number

  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}