import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/validation";
import { preventDuplicate, authenticate, authorizationAdminOs, userIdExists } from "../middleware/auth";
import { checkProfileUrl } from "../middleware/checkUrl";
import { uploadProfileImages } from "../middleware/multer";

const router = Router()


router.post('/create-account',
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('email').isEmail().withMessage('E-mail no valido'),
    body('username').notEmpty().withMessage('El username no puede ir vacio'),
    body('department_id').notEmpty().withMessage('El departamento no puede ir vacio'),
    body('role_id').notEmpty().withMessage('El rol no puede ir vacio'),
    authenticate,
    preventDuplicate,
    authorizationAdminOs,
    handleInputErrors,
    AuthController.createAccount
)
router.post('/superAdmin/create-account',
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña es muy corta, debe tener minimo 8 caracteres'),
    body('email').isEmail().withMessage('E-mail no valido'),
    body('username').notEmpty().withMessage('El username no puede ir vacio'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden')
        }
        return true
    }),
    preventDuplicate,
    handleInputErrors,
    AuthController.createSuperAdminAccount
)
router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
    handleInputErrors,
    AuthController.confirmAccount
)


router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El Token no puede ir vacio'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Token no valido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña es muy corta, debe tener minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)


router.get('/user',
    authenticate,
    AuthController.user
)
router.get('/admin/get-users',
    authenticate,
    AuthController.getUsers
)

router.get('/dashboard/get-users',
    authenticate,
    AuthController.getUsersDashboard
)

router.get('/admin/super-admin-exist',
    AuthController.superAdminExist
)


router.param('user_Id', userIdExists)

router.get('/admin/user/:user_Id',
    authenticate,
    AuthController.getUserByParams
)

router.put('/admin/user/:user_Id',
    AuthController.updateUser
)
router.put('/profile/user/:user_Id',
    authenticate,
    checkProfileUrl,
    uploadProfileImages,
    AuthController.updateProfileUser
)

router.delete('/admin/user/:user_Id',
    AuthController.deleteUser
)



export default router