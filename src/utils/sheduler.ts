import cron from 'node-cron';
import { Op } from 'sequelize';
import { Token } from '../Models/Token';
import { generateToken } from './token';
import { RoomsSchedules } from '../Models/RoomSchedules';

// Función para eliminar los tokens expirados
async function uptdateExpiredTokens() {
    try {
      const currentDate = new Date();
      const expiredTokens = await Token.findAll({
        where: {
          expiresAt: {
            [Op.lte]: currentDate, // Selecciona tokens cuya fecha de expiración es menor o igual a la fecha actual
          },
        },
      });
  
      for (const token of expiredTokens) {
        await token.destroy();
      }
    } catch (error) {
      console.error('Error al eliminar tokens expirados:', error);
    }
  }

  async function uptdateExpiredRoomsSchedule() {
    try {
      const currentDate = new Date();
      const expiredRooms = await RoomsSchedules.findAll({
        where: {
          outTime: {
            [Op.lte]: currentDate, // Selecciona tokens cuya fecha de expiración es menor o igual a la fecha actual
          },
        },
      });

      for (const room of expiredRooms) {
        await room.destroy();
      }
    } catch (error) {
      console.error('Error al eliminar salas de reunión expiradas:', error);
    }
  }
  
  // Programa la tarea para que se ejecute cada hora
  cron.schedule('*/1 * * * *', () => {
    uptdateExpiredTokens()
    uptdateExpiredRoomsSchedule()
  });