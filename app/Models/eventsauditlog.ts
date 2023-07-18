import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Eventsauditlog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public route_accessed:string

  @column()
  public ip_address:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
