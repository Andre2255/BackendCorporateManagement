import type { Request, Response, NextFunction } from 'express'
import { Role } from '../Models/Role'

declare global {
    namespace Express {
        interface Request {
            role?: InstanceType<typeof Role>
        }
    }
}

export async function roleNameExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body
        const role = await Role.findOne({ where: { name: name } })
        if (role) {
            const error = new Error('Ya existe un Rol con ese nombre')
            return res.status(409).json({error: error.message })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export async function roleExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { role_id } = req.user.dataValues
        const role = await Role.findByPk(role_id)
        if (!role) {
            const error = new Error('Rol no encontrado')
            return res.status(404).json({ error: error.message })
        }
        next()

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}
export async function roleIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { role_id } = req.params
        const role = await Role.findByPk(role_id)
        if (!role) {
            const error = new Error('Rol no encontrado')
            return res.status(404).json({ error: error.message })
        }
        
        req.role = role
        next()

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export async function userRolIsAdmin(req: Request, res: Response) {
    try {
        const { role_id } = req.user.dataValues
        const role = await Role.findByPk(role_id)
        if (!role) {
            const error = new Error('Rol no encontrado')
            return res.status(404).json({ error: error.message })
        }
        if(role.dataValues.isAdmin || role.dataValues.isSuperAdmin){
            return true
        } else {
            return false
        }

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export async function userRolIsSuperAdmin(req: Request, res: Response) {
    try {
        const { role_id } = req.user.dataValues
        const role = await Role.findByPk(role_id)
        if (!role) {
            const error = new Error('Rol no encontrado')
            return res.status(404).json({ error: error.message })
        }
        if(role.dataValues.isSuperAdmin){
            return true
        } else {
            return false
        }

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export async function userRolIsManagerSGI(req: Request, res: Response) {
    try {
        const { role_id } = req.user.dataValues
        const role = await Role.findByPk(role_id)
        if (!role) {
            return false
        }
        if(role.dataValues.isManagerSGI){
            return true
        } else {
            return false
        }

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export async function userRolIsUserSGI(req: Request, res: Response) {
    try {
        const { role_id } = req.user.dataValues
        const role = await Role.findByPk(role_id)
        if (!role) {
            return false
        }
        if(role.dataValues.isSGI){
            return true
        } else {
            return false
        }

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}
export async function getUsersRolsManagerSGI(req: Request, res: Response) {
    try {
        const roles = await Role.findAll({
            where: {
              isManagerSGI: true
            }
          });

        if (!roles) {
            return []
        }
        return roles

    } catch (error) {
        console.log(error)
        return []
    }
}
export async function userRolIsManager(req: Request, res: Response) {
    try {
        const { role_id } = req.user.dataValues
        const role = await Role.findByPk(role_id)
        if (!role) {
            return false
        }
        if(role.dataValues.isManager){
            return true
        } else {
            return false
        }

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}


