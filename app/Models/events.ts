import { DateTime, DateTimeOptions } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public event_id :string
  @column()
  public event_name:string
  @column()
  public event_description: string
  @column()
  public event_place:string
  @column()
  public event_date:Date
  @column() // Exclude from serialization
  public event_time: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
