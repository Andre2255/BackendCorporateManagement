import { Router } from "express";
import { body } from "express-validator"
import { handleInputErrors } from "../middleware/validation";
import { authenticate, authorizationManagerSGI, authorizationUserSGI } from "../middleware/auth";
import { checkpcaDocsFilesUrl } from "../middleware/checkUrl";
import { uploadPCADocsFiles } from "../middleware/multer";
import { PCA_DocsController } from "../controllers/PCA_DocsController";
import multer from 'multer';
import { roleExists } from "../middleware/role";
const router = Router()
router.use(authenticate, checkpcaDocsFilesUrl)

router.get('/getAllItems',
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.getAllItems)

router.get('/share/getAllItems',
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.getAllItemsShare)

router.get('/getAllRequest',
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.getAllRequests)
router.get('/getAllNewRequest',
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.getAllNewRequests)

router.post('/newItem',
    body('name')
        .notEmpty().withMessage('El nombre del folder es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.createFolder)

router.post('/share/newItem',
    body('name')
        .notEmpty().withMessage('El nombre del folder es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.createFolderShare)

router.post('/newDocumentWord',
    body('name')
        .notEmpty().withMessage('El nombre del documento es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.createWordDocument)

router.post('/share/newDocumentWord',
    body('name')
        .notEmpty().withMessage('El nombre del documento es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.createWordDocumentShare)

router.post('/newDocumentExcel',
    body('name')
        .notEmpty().withMessage('El nombre del documento es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.createExcelDocument)

router.post('/share/newDocumentExcel',
    body('name')
        .notEmpty().withMessage('El nombre del documento es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.createExcelDocumentShare)

router.post('/newDocumentPowerPoint',
    body('name')
        .notEmpty().withMessage('El nombre del documento es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.createPowerPointDocument)

router.post('/share/newDocumentPowerPoint',
    body('name')
        .notEmpty().withMessage('El nombre del documento es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.createPowerPointDocumentShare)

router.post('/newTextDocument',
    body('name')
        .notEmpty().withMessage('El nombre del documento es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.createTextDocument)

router.post('/uploadItems',
    uploadPCADocsFiles,
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.uploadItems)
router.post('/share/uploadItems',
    uploadPCADocsFiles,
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.uploadItemsShare)

router.post('/replaceItems',
    uploadPCADocsFiles,
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.replaceItems)

router.post('/share/replaceItems',
    uploadPCADocsFiles,
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.replaceItemsShare)


router.post('/requestChangeItem',
    body('reason')
        .notEmpty().withMessage('La nota es Obligatoria'),
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.requestNewChangeItem)
router.post('/requestNewItem',
    body('reason')
        .notEmpty().withMessage('La nota es Obligatoria'),
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.requestNewItem)

router.put('/changeStatusRequest',
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.updateStadeRequest)
router.put('/changeStatusNewRequest',
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.updateStadeNewRequest)

router.put('/renameItem',
    body('name')
        .notEmpty().withMessage('El nombre del item es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.renameItem)

router.put('/share/renameItem',
    body('name')
        .notEmpty().withMessage('El nombre del item es Obligatorio'),
    handleInputErrors,
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.renameItemShare)



router.delete('/deleteItems',
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.deleteItems
)
router.delete('/share/deleteItems',
    roleExists,
    authorizationUserSGI,
    PCA_DocsController.deleteItemsShare
)

router.delete('/deleteRequest',
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.deleteRequest)

router.delete('/deleteNewRequest',
    roleExists,
    authorizationManagerSGI,
    PCA_DocsController.deleteNewRequest)



export default router