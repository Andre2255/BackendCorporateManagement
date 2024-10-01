import server from './server';
import { sequelize } from './config/db'
import './utils/sheduler'
import './Models/User'
import './Models/Role'
import './Models/Department'
import './Models/News'
const port = process.env.API_PORT || 4000


server.listen(port, async ()  => {
    //await sequelize.sync({force:true})
    //await sequelize.sync()
    await sequelize.sync({ alter: true })
    console.log('Conexión a la base de datos establecida correctamente');
    console.log(`REST API funcionando en el puerto ${port}`)
})