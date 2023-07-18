import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import eventsauditlog from 'App/Models/eventsauditlog';


export default class Eventaudit {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    // Code for middleware goes here, ABOVE THE NEXT CALL
    await next();

    const audits = {
      route_accessed: request.url(),
      ip_address: request.ip(),
    };

    await eventsauditlog.create(audits);
  }
}