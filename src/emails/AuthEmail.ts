import { transporter } from "../config/nodemailer"

interface IEmailSendConfirmationEmail {
    email: string
    name: string
    token: string
    pass: string
}
interface IEmail {
    email: string
    name: string
    token: string
}


export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmailSendConfirmationEmail) => {
        try {
            const info = await transporter.sendMail({
                from: 'Panasonic <gestioncorporativapca@outlook.com>',
                to: user.email,
                subject: 'Panasonic - Confirma tu cuenta',
                text: 'Panasonic- Confirma tu cuenta',
                html: `<p>Hola: ${user.name}, se ha creado tu cuenta en la pagina corporativa de PANASONIC, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                    <p>Visita el siguiente enlace:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                    <p>E ingresa el código: <b>${user.token}</b></p>
                    <p>Este token expira en 8 horas</p>
    
                    <p>${user.name}, se ha creado una contraseña de acceso a la pagina corpatariva de PANASONIC, se recomienda cambiarla lo antes posible.</p>
                    <p>Contraseña: <b>${user.pass}</b></p>
                `
            })

            console.log('Mensaje enviado', info.messageId)
        } catch (error) {
            console.log('Hubo un error al enviar el mensaje', error)
        }

    }

    static sendConfirmationEmailRetry = async (user: IEmail) => {
        try {
            const info = await transporter.sendMail({
                from: 'Panasonic <gestioncorporativapca@outlook.com>',
                to: user.email,
                subject: 'Panasonic - Confirma tu cuenta',
                text: 'Panasonic- Confirma tu cuenta',
                html: `<p>Hola: ${user.name}, se ha creado tu cuenta en la pagina corporativa de PANASONIC, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                    <p>Visita el siguiente enlace:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                    <p>E ingresa el código: <b>${user.token}</b></p>
                    <p>Este token expira en 8 horas</p>
                `
            })

            console.log('Mensaje enviado', info.messageId)
        } catch (error) {
            console.log('Hubo un error al enviar el mensaje', error)
        }

    }

    static sendPasswordResetToken = async (user: IEmail) => {
        try {
            const info = await transporter.sendMail({
                from: 'Panasonic <gestioncorporativapca@outlook.com>',
                to: user.email,
                subject: 'Panasonic - Reestablece tu password',
                text: 'Panasonic- Reestablece tu password',
                html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                    <p>Visita el siguiente enlace:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                    <p>E ingresa el código: <b>${user.token}</b></p>
                    <p>Este token expira en 10 minutos</p>
                `
            })

            console.log('Mensaje enviado', info.messageId)
        } catch (error) {
            console.log('Hubo un error al enviar el mensaje', error)
        }

    }

}