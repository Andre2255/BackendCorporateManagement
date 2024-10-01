import type {Request, Response, NextFunction} from 'express'
import { validationResult } from 'express-validator'

export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        const errorMessage = errors.array().map((error) => error.msg).join(', ');
        return res.status(400).json({ error: errorMessage });
    }

    next()
}

/*
export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next()
}
*/