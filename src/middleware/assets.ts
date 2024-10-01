import type { Request, Response, NextFunction } from 'express'
import { AssetsRequest } from '../Models/AssetsRequest'

export async function assetIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const role = await AssetsRequest.findByPk(id)
        if (!role) {
            const error = new Error('Solicitud no encontrada')
            return res.status(404).json({ error: error.message })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}