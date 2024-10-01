import e, { Request, Response } from "express"
import { User } from "../Models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { Token } from "../Models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"
import generatePassword from "../utils/generatePassword"
import { Role } from "../Models/Role"
import { Department } from "../Models/Department"
import { userRolIsAdmin, userRolIsSuperAdmin } from "../middleware/role"


export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const user = User.build(req.body)
            //Hash Password
            const password = generatePassword()
            user.dataValues.password = await hashPassword(password)
            //create user and token
            await user.save()
            //generate token
            const token = Token.build()
            token.dataValues.token = generateToken()
            token.dataValues.user_id = user.dataValues.id

            // send email
            AuthEmail.sendConfirmationEmail({
                email: user.dataValues.email,
                name: user.dataValues.name,
                token: token.dataValues.token,
                pass: password,
            })
            await token.save()
            res.send('Cuenta creada, revisa tu email para confirmarla')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static createSuperAdminAccount = async (req: Request, res: Response) => {
        try {
            const role = await Role.findOne({ where: { isSuperAdmin: true } })
            if (role) return res.status(500).json({ error: 'Hubo un error, ya existe un rol de super administrador existente. Reinicia la aplicacion y la base de datos' })
            if (!role) {
                const beforeCreate = await beforeAdminCreate()
                const { role, department } = beforeCreate
                req.body.role_id = role.get('id')
                req.body.department_id = department.get('id')
                req.body.confirmed = true
            } else {
                res.status(500).json({ error: 'Hubo un error, ya hay un Administrador registrado' })
            }
            const user = User.build(req.body)

            //Hash Password
            const { password } = req.body
            user.dataValues.password = await hashPassword(password)
            //create user and token
            await user.save()

            res.send('Super Administrador Creado')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }


    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ where: { token: token } })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findByPk(tokenExists.dataValues.user_id)
            await Promise.allSettled([user.update({ confirmed: true }), tokenExists.destroy()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }


    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email: email } })
            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }
            // Check password
            const isPasswordCorrect = await checkPassword(password, user.dataValues.password)
            if (!isPasswordCorrect) {
                const error = new Error('Password Incorrecto')
                return res.status(401).json({ error: error.message })
            }
            if (!user.dataValues.confirmed) {
                const token = new Token()
                token.dataValues.user_id = user.dataValues.id
                token.dataValues.token = generateToken()
                await token.save()

                // send email
                AuthEmail.sendConfirmationEmailRetry({
                    email: user.dataValues.email,
                    name: user.dataValues.name,
                    token: token.dataValues.token
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación')
                return res.status(401).json({ error: error.message })
            }
            const token = await generateJWT({ id: user.dataValues.id })
            res.send(token)

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            //Prevent Duplicate
            const user = await User.findOne({ where: { email: email } })
            if (!user) {
                const error = new Error('El usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }
            if (user.dataValues.confirmed) {
                const error = new Error('El usuario ya esta confirmado')
                return res.status(403).json({ error: error.message })
            }

            const tokenExists = await Token.findOne({ where: { user_id: user.dataValues.id } })
            if (tokenExists) {
                tokenExists.destroy()
            }

            //generate token
            const token = Token.build()
            token.dataValues.token = generateToken()
            token.dataValues.user_id = user.dataValues.id

            // send email
            AuthEmail.sendConfirmationEmailRetry({
                email: user.dataValues.email,
                name: user.dataValues.name,
                token: token.dataValues.token
            })
            await token.save()
            res.send('Se envio un nuevo codigo a su email')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            //Prevent Duplicate
            const user = await User.findOne({ where: { email: email } })
            if (!user) {
                const error = new Error('El usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }


            const tokenExists = await Token.findOne({ where: { user_id: user.dataValues.id } })
            if (tokenExists) {
                tokenExists.destroy()
            }

            //generate token
            const token = Token.build()
            token.dataValues.token = generateToken()
            token.dataValues.user_id = user.dataValues.id
            await token.save()
            // send email
            AuthEmail.sendPasswordResetToken({
                email: user.dataValues.email,
                name: user.dataValues.name,
                token: token.dataValues.token
            })
            res.send('Revisa tu email para instrucciones')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ where: { token: token } })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }
            res.send('Codigo valido, define tu nueva contraseña')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params

            const tokenExists = await Token.findOne({ where: { token: token } })
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findByPk(tokenExists.dataValues.user_id)
            await Promise.allSettled([user.update({ password: await hashPassword(req.body.password) }), tokenExists.destroy()])

            res.send('La Contraseña se modifico correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json({ user: req.user, role: req.role })
    }

    static getUsers = async (req: Request, res: Response) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email', 'username', 'department_id', 'role_id', 'photo1'],
            })
            if (users.length > 0) {
                users.forEach((user) => {
                  if (!user.dataValues.photo1) {
                    user.dataValues.photo1 = '';
                  }
                });
              }
            return res.json(users)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }

    }
    static getUsersDashboard = async (req: Request, res: Response) => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email', 'username', 'department_id', 'role_id', 'photo1']
              });
              
              if (users.length > 0) {
                users.forEach((user) => {
                  if (!user.dataValues.photo1) {
                    user.dataValues.photo1 = '';
                  }
                });
              }


            return res.json(users)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }

    }


    static superAdminExist = async (req: Request, res: Response) => {
        try {

            const role = await Role.findOne({ where: { isSuperAdmin: true } })
            if (!role) return res.json({ there_admin: false })
            const userSuperAdmin = await User.findOne({ where: { role_id: role.get('id') } })
            if (userSuperAdmin) {
                return res.json({ there_admin: true })
            } else {
                return res.json({ there_admin: false })
            }
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })

        }
    }
    static getUserByParams = async (req: Request, res: Response) => {
        const { user_Id } = req.params
        try {
            const user = await User.findByPk(user_Id, { attributes: ['id', 'name', 'email', 'username', 'department_id', 'role_id', 'description', 'photo1']})
            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }
            if(!user.dataValues.photo1){
                user.dataValues.photo1=''
            }
            return res.json(user)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }

    }


    static updateUser = async (req: Request, res: Response) => {
        const { user_Id } = req.params
        console.log(req.body)
        const { name, username, email, department_id, role_id } = req.body;
        try {
            const [rowsUpdated] = await User.update(
                { name, username, email, department_id, role_id },
                {
                    where: { id: user_Id },
                    returning: true, // Esto es importante para que devuelva el registro actualizado
                }
            );
            if (rowsUpdated === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).send('Usuario guardado con éxito')
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            res.status(500).json;
        }
    }
    static updateProfileUser = async (req: any, res: Response) => {
        const { user_Id } = req.params
        const { name, email, description } = req.body;
        let photo1: string | undefined;

        if (req.files && req.files.image && req.files.image[0]) {
          photo1 = req.files.image[0].filename;
        }
        try {
            if(req.user.dataValues.id.toString() !== user_Id){
                return res.status(404).json({ error: 'Error de usuario' });
            }
            if (userRolIsSuperAdmin) {
                const [rowsUpdated] = await User.update(
                    { name, email, description, ...(photo1 ? { photo1 } : {}) },
                    {
                        where: { id: user_Id },
                        returning: true, // Esto es importante para que devuelva el registro actualizado
                    }
                );
                if (rowsUpdated === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }
            }
            const [rowsUpdated] = await User.update(
                { name, description, ...(photo1 ? { photo1 } : {}) },
                {
                    where: { id: user_Id },
                    returning: true, // Esto es importante para que devuelva el registro actualizado
                }
            );
            if (rowsUpdated === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).send('Datos actualizados con éxito')
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            res.status(500).json;
        }

    }

    static deleteUser = async (req: Request, res: Response) => {
        const { user_Id } = req.params
        try {
            if (userRolIsSuperAdmin || userRolIsAdmin) {
                const user = await User.findByPk(user_Id)
                if (!user) {
                    const error = new Error(`Usuario no encontrado`)
                    return res.status(500).json({ error: error.message })
                } else {
                    const rol = await Role.findByPk(user.dataValues.role_id)
                    if (!rol) {
                        const error = new Error(`Hubo un error al eliminar el usuario`)
                        return res.status(500).json({ error: error.message })
                    }
                    if (rol.dataValues.isSuperAdmin) {
                        const error = new Error(`No se puede eliminar el super usuario`)
                        return res.status(500).json({ error: error.message })
                    } else {
                        if (rol.dataValues.isAdmin) {
                            if (userRolIsSuperAdmin) {
                                await user.destroy()
                            } else {
                                const error = new Error(`Solo el super administrador puede eliminar este usuario`)
                                return res.status(500).json({ error: error.message })
                            }
                        }
                    }
                    await user.destroy()
                }
            } else {
                const error = new Error('No se tiene los privilegios para realizar esta acción')
                return res.status(500).json({ error: error.message })
            }
            res.send('Usuario Eliminado')
        } catch (error) {
            console.log(error)
            const errormsg = new Error(`Hubo un error ${error}`)
            return res.status(500).json({ error: errormsg.message })
        }
    }

}

const beforeAdminCreate = async () => {
    try {
        const adminRole = {
            name: 'Super_Admin',
            isSuperAdmin: true,
        };
        const adminDepartment = {
            name: 'TI',
        };

        const roleExists = await Role.findOne({ where: { name: adminRole.name } });
        const departmentExists = await Department.findOne({ where: { name: adminDepartment.name } });

        const role = roleExists || await Role.create(adminRole);
        const department = departmentExists || await Department.create(adminDepartment);

        return { role, department };
    } catch (error) {
        return { role: null, department: null };
    }
};