import { AssetsRequest } from "../Models/AssetsRequest"
import { Request, Response } from "express"
import { generateDocx } from "../utils/generateDocx"
import { User } from "../Models/User"
import path from "path"
import fs from 'fs';

export class AssetsController {
    static getAllAssetRequest = async (req: Request, res: Response) => {
        try {
            const assets = await AssetsRequest.findAll({
                order: [
                    ['createDate', 'DESC']
                ]
            })
            res.json(assets)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al obtener todos los Documentos' })
        }
    }

    static getAssetRequestById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const asset = await AssetsRequest.findOne({ where: { id: id } })
            if (!asset) {
                const error = new Error('Documento no encontrado')
                return res.status(404).json({ error: error.message })
            }
            asset.dataValues.devices = asset.dataValues.devices.map((device) => JSON.parse(device));
            res.json(asset.dataValues)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error obteniendo el Documento' })
        }
    }


    static createAssetRequest = async (req: any, res: Response) => {
        const { return_Date, devices } = req.body
        try {
            const asset = AssetsRequest.build(req.body)
            asset.dataValues.devices = devices
            asset.dataValues.managerName = req.user.dataValues.name
            asset.dataValues.create_by = req.user.dataValues.id
            if (return_Date <= asset.dataValues.dateOfLeaving) {
                return res.status(404).json({ error: 'La fecha de regreso debe ser posterior a la fecha de salida.' });
            }
            //Guardar archivos
            let filesUrls = [];
            if (req.files.devicePhotos) {
                req.files.devicePhotos.forEach((file, n) => {
                    filesUrls.push(`${req.files.devicePhotos[n].filename}`);
                });
            }
            asset.dataValues.devicePhotos = filesUrls
            const userName = req.user.dataValues.username
            const createDocument = generateDocx(userName, asset.dataValues)
            asset.dataValues.document = createDocument.documentName
            if (!createDocument.isPassed) {
                return res.status(404).json({ error: 'Hubo un error' });
            }
            asset.dataValues.createDate = Date.now()
            console.log(asset.dataValues)
            await asset.save()
            res.send('Solicitud enviada con éxito')
        } catch (err) {
            console.error(err)
            res.status(500).send({ message: 'Error al crear noticia' })
        }
    }

    static updateAssetRequest = async (req: any, res: Response) => {
        const { id } = req.params
        const { managerName, collaboratorName, managerArea, outputType, workArea, reasonForLeaving, dateOfLeaving, return_Date} = req.body
        try {
            const asset = await AssetsRequest.findByPk(id)
            if (!asset) {
                const error = new Error('Solicitud no encontrada')
                return res.status(404).json({ error: error.message })
            }
            const userCreator = await User.findByPk(asset.dataValues.create_by)
            if (return_Date <= dateOfLeaving) {
                return res.status(404).json({ error: 'La fecha de regreso debe ser posterior a la fecha de salida.' });
            }
            if (!userCreator) {
                const error = new Error('Usuario creador de la solicitud no encontrado')
                return res.status(404).json({ error: error.message })
            }
            const documentNameprev = asset.dataValues.document;
            const filePath = path.join(__dirname, '../uploads/assetsRequest/documents/', documentNameprev);
        
            // Check if the file exists
            fs.stat(filePath, (err, stats) => {
              if (err) {
                console.log(`File ${documentNameprev} not found`);
              } else {
                // Delete the file
                fs.unlink(filePath, (err) => {
                  if (err) {
                    console.error(`Error deleting file ${documentNameprev}: ${err}`);
                  } else {
                    console.log(`File ${documentNameprev} deleted successfully`);
                  }
                });
              }
            });
            req.body.devices = JSON.stringify(req.body.devices)
            req.body.dateOfLeaving = new Date(req.body.dateOfLeaving)
            req.body.return_Date = new Date(req.body.return_Date)
            const createDocument = generateDocx(userCreator.dataValues.username, req.body)
            const documentName = createDocument.documentName
            if (!createDocument.isPassed) {
                return res.status(404).json({ error: 'Hubo un error' });
            }
            const deviceList = req.body.devices
            const devices = deviceList.map(device => JSON.stringify(device));
            const [rowsUpdated, [updatedAsset]] = await AssetsRequest.update(
                { managerName, collaboratorName, managerArea, outputType, workArea, reasonForLeaving, dateOfLeaving, return_Date, devices, document: documentName },
                {
                    where: { id },
                    returning: true, // Esto es importante para que devuelva el registro actualizado
                }
            );
            if (rowsUpdated === 0) {
                return res.status(404).json({ error: 'Solicitud no encontrada' });
            }

            res.send('Solicitud actualizada con éxito')
        } catch (err) {
            console.error(err)
            res.status(500).send({ message: 'Error al crear noticia' })
        }
    }

    static deleteAssetRequest = async (req: any, res: Response) => {
        const { id } = req.params
        console.log(id)
        try {
            const asset = await AssetsRequest.findByPk(id)
            if (!asset) {
                const error = new Error('Solicitud no encontrada')
                return res.status(404).json({ error: error.message })
            }
            const documentNameprev = asset.dataValues.document;
            const filePath = path.join(__dirname, '../uploads/assetsRequest/documents/', documentNameprev);
            // Check if the file exists
            fs.stat(filePath, (err, stats) => {
              if (err) {
                console.log(`File ${documentNameprev} not found`);
              } else {
                // Delete the file
                fs.unlink(filePath, (err) => {
                  if (err) {
                    console.error(`Error deleting file ${documentNameprev}: ${err}`);
                  } else {
                    console.log(`File ${documentNameprev} deleted successfully`);
                  }
                });
              }
            });
            await asset.destroy()

            res.send('Solicitud eliminada')
        } catch (err) {
            console.error(err)
            res.status(500).send({ message: 'Error al crear noticia' })
        }
    }
}