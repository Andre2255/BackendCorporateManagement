import type { Request, Response } from "express"
import { News } from "../Models/News"

declare global {
    namespace Express {
        interface Request {
            new?: InstanceType<typeof News>
        }
    }
}

export class NewsController {
    static getAllNews = async (req: Request, res: Response) => {
        try {
            const news = await News.findAll({ order: [['date', 'DESC']] })
            res.json(news)
        } catch (error) {
            console.log(error)
        }
    }

    static getAllMyNews = async (req: Request, res: Response) => {
        try {
            const news = await News.findAll({
                where: {
                    create_by: req.user.dataValues.id
                },
                order: [['date', 'DESC']] 
            })
            res.json(news)
        } catch (error) {
            console.log(error)
        }
    }

    static getNewById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const news = await News.findOne({ where: { id: id }, raw: true,  attributes: ['title', 'description', 'readMore', 'video', 'image', 'data', 'create_by', 'date']})
            if (!news) {
                const error = new Error('Noticia no encontrada')
                return res.status(404).json({ error: error.message })
            }
            res.json(news)
        } catch (error) {
            console.log(error)
        }

    }


    static createNew = async (req: any, res: Response) => {
        try {
            const news = News.build(req.body)
            // Guardar imagen
            if (req.files.image) {
                const imageUrl = `${req.files.image[0].filename}`;
                // Guardar noticias con imagen 
                news.dataValues.image = imageUrl
            }
            // Guardar archivos
            let filesUrls = [];
            if (req.files.files) {
                req.files.files.forEach((file, n) => {
                    filesUrls.push(`${req.files.files[n].filename}`);
                });
            }
            // Guardar noticias con archivos
            news.dataValues.data = filesUrls
            //assign a creator
            news.dataValues.create_by = req.user.dataValues.id
            news.dataValues.date = new Date();

            await news.save()
            res.send('Noticia creada con éxito')
        } catch (err) {
            console.error(err)
            res.status(500).send({ message: 'Error al crear noticia' })
        }
    }


    static updateNew = async (req: Request, res: Response) => {
        const { id } = req.params
        const { title, description, readMore, video } = req.body;
        try {
            const [rowsUpdated, [updatedNews]] = await News.update(
                { title, description, readMore, video },
                {
                    where: { id },
                    returning: true, // Esto es importante para que devuelva el registro actualizado
                }
            );

            if (rowsUpdated === 0) {
                return res.status(404).json({ error: 'Noticia no encontrada' });
            }

            res.status(200).send('Noticia actualizada con éxito')
        } catch (error) {
            console.error("Error al actualizar la noticia:", error);
            res.status(500).json;
        }
    }

    static deleteNew = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const news = await News.findOne({ where: { id: id } })
            if (!news) {
                const error = new Error('Noticia no encontrada')
                return res.status(404).json({ error: error.message })
            }
            await news.destroy()
            res.send('Noticia Eliminada')
        } catch (error) {
            console.log(error)
        }
    }
}



