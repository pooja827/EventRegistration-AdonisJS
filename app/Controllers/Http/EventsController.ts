import{schema,rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import events from'App/Models/events'


export default class EventsController {
//Selectall
public async selectAll(){
const em = await events.all()
return em

}

//SelectionBy
public async selectById({params}:HttpContextContract){
    const viewevent = await events.findBy('id',params.id)
    if (!viewevent) {
        return 'The event with the specified ID does not exist.'
      }
    return viewevent 
    
}

//Insertion
public async insertion({request}: HttpContextContract){
    const insertion = schema.create({
        event_id: schema.string(),
        event_name: schema.string(),
        event_description: schema.string(),
        event_place: schema.string(),
        event_date: schema.date(),
        event_time: schema.string({}, [
            rules.regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/),
          ]),
        
        })
        const { event_date, ...inserts } = await request.validate({ schema: insertion })
        const inserted =await events.create({
        event_id:inserts.event_id,
        event_name:inserts.event_name,
        event_description:inserts.event_description,
        event_place:inserts.event_place,
        event_date:event_date.toJSDate(),
        event_time:inserts.event_time,
    
 })
 return "Event details added successfully"
}

//updation
public async updation({ request, response, params }: HttpContextContract) {
    try {
      const updation = schema.create({
        event_id: schema.string(),
        event_name: schema.string(),
        event_description: schema.string(),
        event_place: schema.string(),
        event_date: schema.date(),
        event_time: schema.string({}, [
            rules.regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/),
          ]),
      });
  
      const { event_date, ...updateevent } = await request.validate({ schema: updation });
      const updates = await events.findOrFail(params.id);
  
      updates.event_id = updateevent.event_id;
      updates.event_name = updateevent.event_name;
      updates.event_description = updateevent.event_description;
      updates.event_place = updateevent.event_place;
      updates.event_date = event_date.toJSDate();
      updates.event_time = updateevent.event_time;

  
      await updates.save();
  
      return "Events details updated Successfully!";
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        response.notFound({
          error: 'Event not found',
        });
      } else {
        response.internalServerError({
          error: 'An error occurred while updating event details',
        });
      }
    }
  }

  //Deletion
  public async deletion({ params, response }: HttpContextContract) {
    const delemp = await events.findBy('id', params.id);
    
    if (!delemp) {
      return 'The event with the specified ID does not exist.';
    }
    
    try {
      await delemp.delete();
      return 'Event Details Deleted Successfully!';
    } catch (error) {
      response.internalServerError({
        error: 'An error occurred while deleting event details',
      });
    }
  }

 // Update the path to the Event model

  public async searchAll({ params, request, response }: HttpContextContract) {
    const { search } = request.all();
    const event= await events.query()
      .where(function (query) {
        query
          .where('event_place', 'ILIKE', `%${search}%`)
          .orWhereRaw('event_date::text ILIKE ?', `%${search}%`)
          .orWhereRaw('event_time::text ILIKE ?', `%${search}%`)
      })
      
  
    return response.json(event);
  }
  
  
}



