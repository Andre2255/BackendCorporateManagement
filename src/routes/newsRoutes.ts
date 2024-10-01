import { Router } from "express";
import { body, param } from "express-validator"
import { NewsController } from "../controllers/NewsController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate, authorizationManager } from "../middleware/auth";
import { checknewsFilesUrl } from "../middleware/checkUrl";
import { uploadNewsFiles } from "../middleware/multer";
const router = Router()
router.use(authenticate)


router.post('/',
    checknewsFilesUrl,
    uploadNewsFiles,
    body('title')
        .notEmpty().withMessage('El titulo de la noticia es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion de la noticia es Obligatoria'),
    authorizationManager,
    handleInputErrors,
    NewsController.createNew)


router.get('/', NewsController.getAllNews)

router.get('/mynews',
    authorizationManager,
    NewsController.getAllMyNews)

router.get('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    handleInputErrors,
    NewsController.getNewById)

router.put('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    body('title')
        .notEmpty().withMessage('El titulo de la noticia es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion de la noticia es Obligatoria'),
    authorizationManager,
    handleInputErrors,
    NewsController.updateNew)

router.delete('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    authorizationManager,
    handleInputErrors,
    NewsController.deleteNew)


    

export default router