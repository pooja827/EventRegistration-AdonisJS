import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class events extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public eventId :string
  @column()
  public eventCategoryId :string
  @column()
  public eventName:string
  @column()
  public eventDescription: string
  @column()
  public eventPlace:string
  @column()
  public eventDate:Date
  @column() 
  public eventTime: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
