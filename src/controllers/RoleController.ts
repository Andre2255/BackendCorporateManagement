import type { Request, Response } from "express"
import { Role } from "../Models/Role"
import { User } from "../Models/User"
import { roleNameExists, userRolIsAdmin, userRolIsSuperAdmin } from "../middleware/role"

export class RoleController {
    static getAllRole = async (req: Request, res: Response) => {
        try {
            const roles = await Role.findAll({ raw: true })
            res.json(roles)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al obtener todos los Roles' })
        }
    }

    static getRoleById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const role = await Role.findOne({ where: { id: id } })
            if (!role) {
                const error = new Error('Rol no encontrado')
                return res.status(404).json({ error: error.message })
            }
            res.json(role)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error obteniendo el Rol' })
        }
    }


    static createRole = async (req: Request, res: Response) => {
        try {
            const role = Role.build(req.body)
            await role.save()
            res.send('Rol Creado')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error guardando el rol' })
        }
    }


    static updateRole = async (req: Request, res: Response) => {
        const { name, isManager, isAdmin, isSuperAdmin, isSGI, isManagerSGI } = req.body
        const { role_id } = req.params
        try {
            const roleDuplicate = await Role.findOne({ where: { name: name } })
            if (roleDuplicate && roleDuplicate.dataValues.id !== Number(role_id)) {
                const error = new Error('Ya existe un Rol con ese nombre')
                return res.status(409).json({error: error.message })
            }
            const role = await Role.findByPk(role_id)

            await role.update(
                { name, isManager, isAdmin, isSuperAdmin, isSGI, isManagerSGI }
            )
            res.send('Rol Actualidado')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error actualizando el Rol' })
        }
    }

    static deleteRole = async (req: Request, res: Response) => {
        try {
            if (userRolIsSuperAdmin || userRolIsAdmin) {
                const users = await User.findAll({
                    attributes: ['id', 'role_id'],
                })
                const usersInRole = users.filter(
                    (user) => user.dataValues.role_id === req.role.dataValues.id
                )
                if (usersInRole.length > 0) {
                    const error = new Error(`No se puede eliminar el rol ${req.role.dataValues.name} porque hay usuarios asignados a este rol`)
                    return res.status(500).json({ error: error.message })
                } else {
                    if (req.role.dataValues.isSuperAdmin) {
                        const error = new Error(`No se puede eliminar al Super Administrador`)
                        return res.status(500).json({ error: error.message })
                    }
                    if (req.role.dataValues.isAdmin) {
                        if (userRolIsSuperAdmin) {
                            await req.role.destroy()
                        } else {
                            const error = new Error(`Solo el super administrador puede eliminar este rol`)
                            return res.status(500).json({ error: error.message })
                        }
                    }
                    await req.role.destroy()
                }
            } else {
                const error = new Error('No se tiene los privilegios para realizar esta acción')
                return res.status(500).json({ error: error.message })
            }
            res.send('Rol Eliminado')
        } catch (error) {
            console.log(error)
            const errormsg = new Error(`Hubo un error ${error}`)
            return res.status(500).json({ error: errormsg.message })
        }
    }

}

