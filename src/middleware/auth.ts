import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../Models/User'
import { Role } from '../Models/Role'
import { userRolIsAdmin, userRolIsManager, userRolIsManagerSGI, userRolIsSuperAdmin, userRolIsUserSGI } from './role'

declare global {
    namespace Express {
        interface Request {
            user?: InstanceType<typeof User>
            role?: InstanceType<typeof Role>
        }
    }
}


export const authenticate = async (req: any, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if (!bearer) {
        const error = new Error('No Autorizado')
        return res.status(401).json({ error: error.message })
    }
    const [, token] = bearer.split(' ')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findByPk(decoded.id, {
                attributes: ['id', 'name', 'email', 'username', 'department_id', 'role_id', 'description', 'photo1']
            })
            if (user) {
                if (!user.dataValues.photo1) {
                    user.dataValues.photo1 = ''
                }
                req.user = user
            }
            const role = await Role.findByPk(user.dataValues.role_id)
            if (role) {
                req.role = role
                next()
            } else {
                res.status(500).json({ error: 'Token No Válido' })
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Token No Válido' })
    }

}

export const authorizationManager = async (req: Request, res: Response, next: NextFunction) => {
    const isManager = await userRolIsManager(req, res)
    const isAdmin = await userRolIsAdmin(req, res)
    const isSuperAdmin = await userRolIsSuperAdmin(req, res) 
    try {
        if (isManager || isAdmin || isSuperAdmin) {
            next()
        }
        else {
            return res.status(500).json({ error: 'Solo Managers o Adminitradores pueden realizar esta accion' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Token No Válido' })
    }

}

export const authorizationAdminOs = async (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = await userRolIsAdmin(req, res)
    const isSuperAdmin = await userRolIsSuperAdmin(req, res)
    try {
        if (isAdmin || isSuperAdmin) {
            next()
        }
        else {
            return res.status(500).json({ error: 'Solo Adminitradores pueden realizar esta accion' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Token No Válido' })
    }

}
export const authorizationManagerSGI = async (req: Request, res: Response, next: NextFunction) => {
    const isManagerSGI = await userRolIsManagerSGI(req, res)
    try {
        if (isManagerSGI) {
            next()
        }
        else {
            return res.status(500).json({ error: 'Solo Managers SGI pueden realizar esta accion' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Token No Válido' })
    }

}
export const authorizationUserSGI = async (req: Request, res: Response, next: NextFunction) => {
    const isManagerSGI = await userRolIsUserSGI(req, res)
    try {
        if (isManagerSGI) {
            next()
        }
        else {
            return res.status(404).json({ error: 'Solo Managers SGI pueden realizar esta accion' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Token No Válido' })
    }

}

export const preventDuplicate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email } = req.body
        //Prevent Duplicate
        const usernameExist = await User.findOne({ where: { username: username } })
        if (usernameExist) {
            const error = new Error('El username ya esta en uso')
            return res.status(409).json({ error: error.message })
        }
        const emailExist = await User.findOne({ where: { email: email } })
        if (emailExist) {
            const error = new Error('El email ya esta en uso')
            return res.status(409).json({ error: error.message })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: 'Token No Válido' })
    }

}

export async function userIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { user_Id } = req.params
        const user = await User.findByPk(user_Id)
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }
        next()

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}