import type { Request, Response } from "express"
import { MeetingRooms } from "../Models/MeetingRooms"
import { RoomsSchedules } from "../Models/RoomSchedules"
import { Op } from "sequelize"

export class RoomsController {
    static getAllRooms = async (req: Request, res: Response) => {

        try {
            const rooms = await MeetingRooms.findAll({ raw: true })
            res.json(rooms)
        } catch (error) {
            console.log(error)
        }
    }
    static getAllRoomsSchedules = async (req: Request, res: Response) => {
        const { inTime, outTime } = req.query;

        // Validar que inTime sea menor que outTime
        if (new Date(inTime as string) >= new Date(outTime as string)) {
            return res.status(400).json({ error: 'inTime debe ser menor que outTime ' });
        }

        try {
            // Obtener todos los horarios que coincidan con el rango de fechas
            const schedules = await RoomsSchedules.findAll({
                where: {
                    [Op.or]: [
                        {
                            inTime: {
                                [Op.lte]: outTime,
                                [Op.gte]: inTime,
                            },
                        },
                        {
                            outTime: {
                                [Op.gte]: inTime,
                                [Op.lte]: outTime,
                            },
                        },
                        {
                            inTime: {
                                [Op.lte]: inTime,
                            },
                            outTime: {
                                [Op.gte]: outTime,
                            },
                        },
                    ],
                },
            })

            // Obtener todas las salas
            const rooms = await MeetingRooms.findAll();

            // Crear la respuesta
            const response = rooms.map((room) => {
                const schedule = schedules.find((schedule) => schedule.dataValues.meetingRoom === room.dataValues.id);
                if (schedule) {
                    return {
                        roomId: room.dataValues.id,
                        inDate: schedule.dataValues.inTime,
                        outDate: schedule.dataValues.outTime,
                        avalaible: false,
                        user: schedule.dataValues.reservedby,
                        reason: schedule.dataValues.reason
                    };
                } else {
                    return {
                        roomId: room.dataValues.id,
                        inDate: inTime,
                        outDate: outTime,
                        avalaible: true,
                        user: null,
                        reason: ''
                    };
                }
            });
            return res.json(response);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
    static getAllReservedRoomsSchedules = async (req: Request, res: Response) => {

        try {
            const schedules = await RoomsSchedules.findAll()
            const response = schedules.map((room) => {
                return {
                    roomId: room.dataValues.meetingRoom,
                    inDate: room.dataValues.inTime,
                    outDate: room.dataValues.outTime,
                    avalaible: false,
                    user: room.dataValues.reservedby,
                    reason: room.dataValues.reason
                };

            }).sort((a, b) => {
                return new Date(a.inDate).getTime() - new Date(b.inDate).getTime();
            });
            return res.json(response);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    static getRoomByParams = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const room = await MeetingRooms.findByPk(id)
            if (!room) {
                const error = new Error('Sala no encontrada')
                return res.status(404).json({ error: error.message })
            }
            res.json(room)
        } catch (error) {
            console.log(error)
        }
    }
    static getRoomById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const room = await MeetingRooms.findOne({ where: { id: id } })
            if (!room) {
                const error = new Error('Sala no encontrada')
                return res.status(404).json({ error: error.message })
            }
            res.json(room)
        } catch (error) {
            console.log(error)
        }
    }


    static createRoom = async (req: Request, res: Response) => {
        try {
            const room = MeetingRooms.build(req.body)
            await room.save()
        } catch (error) {
            console.error("Error saving teh room:", error);
        }
        res.send('Sala Creada ')
    }
    static createRoomSchedule = async (req: Request, res: Response) => {
        try {
            const room = RoomsSchedules.build(req.body)
            room.dataValues.reservedby = req.user.dataValues.id
            await room.save()
        } catch (error) {
            console.error("Error saving teh room:", error);
        }
        res.send('Sala Reservada')
    }

    static updateRoom = async (req: Request, res: Response) => {
        const { room_id } = req.params
        const { name } = req.body
        try {
            const roomDuplicate = await MeetingRooms.findOne({ where: { name: name } })
            if (roomDuplicate && roomDuplicate.dataValues.id !== Number(room_id)) {
                const error = new Error('Ya existe una sala con ese nombre')
                return res.status(409).json({ error: error.message })
            }
            const room = await MeetingRooms.findByPk(room_id)
            if (!room) {
                const error = new Error('Sala no encontrada')
                return res.status(409).json({ error: error.message })
            }
            await room.update(
                { name }
            )
            res.send('Sala Actualizada')
        } catch (error) {
            console.error("Error al actualizar la sala:", error);
            res.status(500).json;
        }
    }

    static deleteRoom = async (req: Request, res: Response) => {
        const { room_id } = req.params
        try {
            const room = await MeetingRooms.findByPk(room_id)
            const roomSchedule = await RoomsSchedules.destroy({
                where: {
                  meetingRoom: room_id
                }
              })
            console.log('Salas eliminadas', roomSchedule)
            if (!room) {
                const error = new Error('Sala no encontrada')
                return res.status(409).json({ error: error.message })
            }
            await room.destroy()
            res.send('Sala Eliminada')
        } catch (error) {
            console.error("Error al actualizar la sala:", error);
            res.status(500).json;
        }
    }
}
