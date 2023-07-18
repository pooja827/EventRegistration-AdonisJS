import{schema,rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import events from'App/Models/events'
import eventsauditlog from 'App/Models/eventsauditlog';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
async function convertTableToCsv(tableData, filePath) {
  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: 'route_accessed', title: 'Route Accessed' },
      { id: 'ip_address', title: 'IP Address' },
    ],
    append: fs.existsSync(filePath), // Check if file exists to determine if it should append
  });

  await csvWriter.writeRecords(tableData);
}
export default class EventsController {
//Selectall
public async selectAll(){
const viewallevent = await events.all()
return viewallevent

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
        eventId: schema.string(),
        eventCategoryId: schema.string(),
        eventName: schema.string(),
        eventDescription: schema.string(),
        eventPlace: schema.string(),
        eventDate: schema.date(),
        eventTime: schema.string({}, [
            rules.regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/),
          ]),
        
        })
        const { eventDate, ...inserts } = await request.validate({ schema: insertion })
        const inserted =await events.create({
        eventId:inserts.eventId,
        eventCategoryId:inserts.eventCategoryId,
        eventName:inserts.eventName,
        eventDescription:inserts.eventDescription,
        eventPlace:inserts.eventPlace,
        eventDate:eventDate.toJSDate(),
        eventTime:inserts.eventTime,
    
 })
 return "Event details added successfully"
}
    
  public async updation({ request, response, params }: HttpContextContract) {
  try {
    const updation = schema.create({
      eventId: schema.string.optional(),
      eventCategoryId: schema.string.optional(),
      eventName: schema.string.optional(),
      eventDescription: schema.string.optional(),
      eventPlace: schema.string.optional(),
      eventDate: schema.date.optional(),
      eventTime: schema.string.optional({}, [
        rules.regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/),
      ]),
    });

    const { eventDate, ...updateevent } = await request.validate({ schema: updation });
    const updates = await events.findOrFail(params.id);

    // Check if the specific fields are provided in the updateevent object
    if (updateevent.eventId) {
      updates.eventId = updateevent.eventId;
    }
    if (updateevent.eventCategoryId) {
      updates.eventCategoryId = updateevent.eventCategoryId;
    }
    if (updateevent.eventName) {
      updates.eventName = updateevent.eventName;
    }
    if (updateevent.eventDescription) {
      updates.eventDescription = updateevent.eventDescription;
    }
    if (updateevent.eventPlace) {
      updates.eventPlace = updateevent.eventPlace;
    }
    if (eventDate) {
      updates.eventDate = eventDate.toJSDate();
    }
      
    if (updateevent.eventTime) {
      updates.eventTime = updateevent.eventTime;
    }

  
      await updates.save();
  
      return "Events details updated Successfully!";
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND'||error.code==='') {
        response.notFound({
          error: 'Event not found',
        });
      } else {
        response.internalServerError({
          error: 'Error:id is only of type integer',
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

 // search

  public async searchAll({ params, request, response }: HttpContextContract) {
    const { search } = request.all();
    const event= await events.query()
      .where(function (query) {
        query
          .where('eventPlace', 'ILIKE', `%${search}%`)
          .orWhere('eventName', 'ILIKE', `%${search}%`)
          .orWhereRaw('eventDate::text ILIKE ?', `%${search}%`)
          .orWhereRaw('eventTime::text ILIKE ?', `%${search}%`)
      })
      
  
    return response.json(event);
  }
  public async checkEventId({ request, response, params }: HttpContextContract) {
   

    // Check if the eventId already exists in the database
    const event = await events.findBy('eventId', params.eventId);

    const isDuplicate = !!event; // Convert event to a boolean value

    return response.json({ isDuplicate });
  }
  public async store({ request, response }: HttpContextContract) {
    const { route_accessed, ip_address } = request;

    const audits = {
      route_accessed,
      ip_address,
    };

    await eventsauditlog.create(audits);

    const tableData = await eventsauditlog.query().select('*');

    const filePath = 'C:/Users/Hi/Desktop/Auditlog/output.csv';

    await eventsauditlog.query().delete();

    await convertTableToCsv(tableData, filePath);

    return response.status(200).json({ message: 'Data converted and stored successfully.' });
  }
  public async downloadCSV({ response }: HttpContextContract) {
    const filePath = 'C:/Users/Hi/Desktop/Auditlog/output.csv'; // Path to the CSV file

    try {
      const fileStream = fs.createReadStream(filePath);
      const fileName = path.basename(filePath);

      response.header('Content-type', 'text/csv');
      response.header('Content-Disposition', `attachment; filename=${fileName}`);

      return fileStream.pipe(response.response);
    } catch (error) {
      return response.status(500).json({ error: 'Failed to download CSV file' });
    }
  }
}




