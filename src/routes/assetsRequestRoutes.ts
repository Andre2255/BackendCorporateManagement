import { Router } from "express";
import { body, param } from "express-validator"
import { AssetsController } from "../controllers/AssetsController";
import { handleInputErrors } from "../middleware/validation";
import { checkassetFilesUrl } from "../middleware/checkUrl";
import { authenticate, authorizationManager } from "../middleware/auth";
import { uploadAssetsRequestFiles } from "../middleware/multer";
import { assetIdExists } from "../middleware/assets";


const router = Router()

router.use(authenticate)
router.get('/', AssetsController.getAllAssetRequest)



router.post('/',
    checkassetFilesUrl,
    uploadAssetsRequestFiles,
    body('collaboratorName')
        .notEmpty().withMessage('El el nombre del colaborador es Obligatorio'),
    body('managerArea')
        .notEmpty().withMessage('El Gerente del area es Obligatorio'),
    body('outputType')
        .notEmpty().withMessage('El Tipo de salida es Obligatorio'),
    body('workArea')
        .notEmpty().withMessage('El Area en la que trabaja es Obligatorio'),
    body('reasonForLeaving')
        .notEmpty().withMessage('El Motivo de salida es Obligatorio'),
    body('return_Date')
        .notEmpty().withMessage('La fecha en la que devolverá el dispositivo es obligatorio'),
    handleInputErrors,
    AssetsController.createAssetRequest)
    
router.param('id', assetIdExists)

router.get('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    authorizationManager,
    handleInputErrors,
    AssetsController.getAssetRequestById)

router.put('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    body('collaboratorName')
        .notEmpty().withMessage('El el nombre del colaborador es Obligatorio'),
    body('managerArea')
        .notEmpty().withMessage('El Gerente del area es Obligatorio'),
    body('outputType')
        .notEmpty().withMessage('El Tipo de salida es Obligatorio'),
    body('workArea')
        .notEmpty().withMessage('El Area en la que trabaja es Obligatorio'),
    body('reasonForLeaving')
        .notEmpty().withMessage('El Motivo de salida es Obligatorio'),
    body('return_Date')
        .notEmpty().withMessage('La fecha en la que devolverá el dispositivo es obligatorio'),
    authorizationManager,
    handleInputErrors,
    AssetsController.updateAssetRequest)

router.delete('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    authorizationManager,
    handleInputErrors,
    AssetsController.deleteAssetRequest)




export default router
