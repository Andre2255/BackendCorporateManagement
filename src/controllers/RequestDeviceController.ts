import type { Request, Response } from "express"
import { AssetsRequest } from "../Models/AssetsRequest";

export class RequestDeviceController {
    static createRequestDevice = async (req: any, res: Response) => {
        try {
            console.log("si")
            const requestDevice = AssetsRequest.build(req.body)

            // Guardar archivos
            let filesUrls = [];
            if (req.files.devicePhotos) {
                req.files.files.forEach((file, n) => {
                    console.log(file, n)
                    filesUrls.push(`/uploads/${req.files.files[n].filename}`);
                });
            }

            // Guardar RequestDevice con imagenes
            requestDevice.dataValues.devicePhotos = filesUrls
            //assign a creator
            requestDevice.dataValues.create_by = req.user.dataValues.id
            requestDevice.dataValues.dateOfLeaving = new Date();

            await requestDevice.save()
            res.send('Solicitud enviada con éxito')
        } catch (err) {
            console.error(err)
            res.status(500).send({ message: 'Error al crear noticia' })
        }
    }
}
