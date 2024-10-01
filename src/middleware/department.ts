import type { Request, Response, NextFunction } from 'express'
import { Department } from '../Models/Department'

declare global {
    namespace Express {
        interface Request {
            department?: InstanceType<typeof Department>
        }
    }
}

export async function departmentNameExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body
        const department = await Department.findOne({ where: { name: name } })

        if (department) {
            const error = new Error('El Departamento ya existe')
            return res.status(404).json({ error: error.message })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export async function departmentIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { department_id } = req.params
        const department = await Department.findByPk(department_id)
        if (!department) {
            const error = new Error('Departamento no encontrado')
            return res.status(404).json({ error: error.message })
        }
        
        req.department = department
        next()

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}