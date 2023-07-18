/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Eventaudit from 'App/Middleware/EventAudit';

Route.get('/', async () => {
  return { hello: 'world' }
})
Route.group(()=>{
  Route.get('/selectevent','EventsController.selectAll')
Route.post('/insertevent', 'EventsController.insertion')
Route.get('selectedevent/:id','EventsController.selectById')
Route.put('updationevent/:id','EventsController.updation')
Route.delete("Deletionevent/:id",'EventsController.deletion')
Route.get("/searchevent/",'EventsController.searchAll')
Route.get('/check/:eventId', 'EventsController.checkEventId');

  }).middleware('Eventaudit');
  Route.post('/converttocsv', 'EventsController.store')
  Route.get('/download', 'EventsController.downloadCSV');

  export default Route;
// Route.get('/logging', async ({ request, response }) => {
//   const logMiddleware = new Eventaudit();
//   await logMiddleware.handle({ request }, async () => {
//     return response.send('Logging executed successfully');
//   });
// });

