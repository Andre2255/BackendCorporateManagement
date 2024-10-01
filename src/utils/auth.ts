import bcrypt from 'bcrypt'
import { Role } from '../Models/Role'


export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}
export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcrypt.compare(enteredPassword, storedHash)
}

export const adminExist = async () => {
    const role = await Role.findOne({ where: { isAdmin: true } })
    if (!role) {
        return false
    }
}

