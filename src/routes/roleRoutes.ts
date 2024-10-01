import { Router } from "express";
import { body, param } from "express-validator"
import { RoleController } from "../controllers/RoleController";
import { handleInputErrors } from "../middleware/validation";
import { roleNameExists, roleIdExists } from "../middleware/role";
import { authenticate, authorizationAdminOs, authorizationManager } from "../middleware/auth";


const router = Router()

router.use(authenticate,)

router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre del Rol es Obligatorio'),
    authorizationAdminOs,
    roleNameExists,
    handleInputErrors,
    RoleController.createRole)

router.get('/', RoleController.getAllRole)

router.get('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    handleInputErrors,
    RoleController.getRoleById)

router.param('role_id', roleIdExists)

router.put('/:role_id',
    param('role_id').isInt().withMessage('El ID no es Valido'),
    body('name')
        .notEmpty().withMessage('El nombre del Rol es Obligatorio'),
    authorizationAdminOs,
    handleInputErrors,
    RoleController.updateRole)

router.delete('/:role_id',
    param('role_id').isInt().withMessage('El ID no es Valido'),
    authorizationAdminOs,
    handleInputErrors,
    RoleController.deleteRole)

export default router
