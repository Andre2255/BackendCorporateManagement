import jwt from 'jsonwebtoken';
import { User } from '../Models/User'; 

type UserPayload = {
    id: number;
}

export const generateJWT = async (payload: UserPayload) => {
    try {
        const user = await User.findByPk(payload.id); // Busca el usuario en la base de datos usando el ID de payload
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '180d'
        });
        return token;
    } catch (error) {
        throw new Error('Error al generar el token JWT');
    }
}