import { transporter } from "../config/nodemailer"

interface IRChange {
    email: string
    name: string
    userName: string
    urlFile: string
    documentName: string
    reason: string
}
interface IRChange {
    email: string
    name: string
    userName: string
    urlFile: string
    documentName: string
    reason: string
}
interface IRNew {
    email: string
    name: string
    userName: string
    reason: string
}
export class SGIEmail {
    static sendRequestChangeSGI = async (data: IRChange) => {
        const attachment = {
            filename: data.documentName, 
            path: data.urlFile 
        }
        try {
            const info = await transporter.sendMail({
                from: 'Panasonic <gestioncorporativapca@outlook.com>',
                to: data.email,
                subject: 'Panasonic - Solicitud de cambio de documento en la plataforma SGI',
                text: 'Panasonic - Solicitud de cambio de documento',
                html: `<p>${data.name}, el usuario ${data.userName} ha solicitado cambiar el documento en la plataforma SGI.</p>
                <p>Motivo: ${data.reason} .</p>
                    <p>Puede descargar el nuevo documento adjunto a este correo electrónico.</p>
                `,
                attachments: [attachment]
            });
    
            console.log('Mensaje enviado', info.messageId);
        } catch (error) {
            console.log('Hubo un error al enviar el mensaje', error)
        }

    }
    static sendRequestNewFileSGI = async (data: IRNew) => {
        try {
            const info = await transporter.sendMail({
                from: 'Panasonic <gestioncorporativapca@outlook.com>',
                to: data.email,
                subject: 'Panasonic - Solicitud de nuevo documento en la plataforma SGI',
                text: 'Panasonic - Solicitud de nuevo documento',
                html: `<p>${data.name}, el usuario ${data.userName} ha solicitado un nuevo documento en la plataforma SGI.</p>
                <p>Motivo: ${data.reason} .</p>
                `,
            });
    
            console.log('Mensaje enviado', info.messageId);
        } catch (error) {
            console.log('Hubo un error al enviar el mensaje', error)
        }

    }
}