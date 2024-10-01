import type { Request, Response } from "express"
import { Department } from "../Models/Department"
import { Role } from "../Models/Role"
import { User } from "../Models/User"

export class DepartmentController {
    static getAllDepartment = async (req: Request, res: Response) => {

        try {
            const department = await Department.findAll({ raw: true })
            res.json(department)
        } catch (error) {
            console.log(error)
        }
    }
    static getDepartmentByParams = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const department = await Department.findByPk(id)
            if(!department){
                const error = new Error('Departamento no encontrado')
                return res.status(404).json({ error: error.message })
            }
            res.json(department)
        } catch (error) {
            console.log(error)
        }
    }
    static getDepartmentById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const department = await Department.findOne({ where: { id: id } })
            if (!department) {
                const error = new Error('Departamento no encontrado')
                return res.status(404).json({ error: error.message })
            }
            res.json(department)
        } catch (error) {
            console.log(error)
        }
    }


    static createDepartment = async (req: Request, res: Response) => {
        const department = Department.build(req.body)
        try {
            await department.save()
        } catch (error) {
            console.error("Error saving Department:", error);
        }
        res.send('Departamento Creado ')
    }


    static updateDepartment = async (req: Request, res: Response) => {
        const { department_id } = req.params
        const { name } = req.body
        try {
            const departmentDuplicate = await Department.findOne({ where: { name: name } })
            console.log(departmentDuplicate)
            if (departmentDuplicate && departmentDuplicate.dataValues.id !== Number(department_id)) {
                const error = new Error('Ya existe un Departamento con ese nombre')
                return res.status(409).json({error: error.message })
            }
            const department = await Department.findByPk(department_id)
            if(!department){
                const error = new Error('Departamento no encontrado')
                return res.status(409).json({error: error.message })
            }
            await department.update(
                { name }
            )
            res.send('Departamento Actualizado')
        } catch (error) {
            console.error("Error al actualizar el Departamento:", error);
            res.status(500).json;
        }
    }

    static deleteDepartment = async (req: Request, res: Response) => {
        try {
            if (req.role.dataValues.isSuperAdmin || req.role.dataValues.isAdmin) {
                const users = await User.findAll({
                    attributes: ['id', 'department_id', 'role_id'],
                })
                const usersInDepartment = users.filter(
                    (user) => user.dataValues.department_id === req.department.dataValues.id
                )
                if (usersInDepartment.length > 0) {
                    const error = new Error(`No se puede eliminar el departamento ${req.department.dataValues.name} porque hay usuarios asignados a este departamento`)
                    return res.status(500).json({ error: error.message })
                  } else {
                    await req.department.destroy()
                  }

            } else {
                const error = new Error('No se tiene los privilegios para realizar esta acción')
                return res.status(500).json({ error: error.message })
            }
            
            res.send('Departamento Eliminado')
        } catch (error) {
            console.log(error)
            const errormsg = new Error(`Hubo un error ${error}`)
            return res.status(500).json({ error: errormsg.message })
        }
    }
}
