import type { Request, Response, NextFunction } from 'express'
import { Department } from '../Models/Department'
import { MeetingRooms } from '../Models/MeetingRooms'

declare global {
    namespace Express {
        interface Request {
            department?: InstanceType<typeof Department>
        }
    }
}

export async function roomNameExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body
        const room = await MeetingRooms.findOne({ where: { name: name } })

        if (room) {
            const error = new Error('La sala ya existe')
            return res.status(404).json({ error: error.message })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export async function roomIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { room_id } = req.params
        const room = await MeetingRooms.findByPk(room_id)
        if (!room) {
            const error = new Error('Sala no encontrada')
            return res.status(404).json({ error: error.message })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}