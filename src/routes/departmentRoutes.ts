import { Router } from "express";
import { body, param } from "express-validator"
import { DepartmentController } from "../controllers/DepartmentController";
import { handleInputErrors } from "../middleware/validation";
import { departmentNameExists, departmentIdExists } from "../middleware/department";
import { authenticate, authorizationAdminOs, authorizationManager } from "../middleware/auth";

const router = Router()

router.use(authenticate)

router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre del Departamento es Obligatorio'),
    authorizationAdminOs,
    departmentNameExists,
    handleInputErrors,
    DepartmentController.createDepartment)

router.get('/', DepartmentController.getAllDepartment)


router.get('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    handleInputErrors,
    DepartmentController.getDepartmentById)


router.param('department_id', departmentIdExists)
router.get('/:id', DepartmentController.getAllDepartment)

router.put('/:department_id',
    param('department_id').isInt().withMessage('El ID no es Valido'),
    body('name')
        .notEmpty().withMessage('El nombre del Departamento es Obligatorio'),
    authorizationAdminOs,
    handleInputErrors,
    DepartmentController.updateDepartment)

router.delete('/:department_id',
    param('department_id').isInt().withMessage('El ID no es Valido'),
    authorizationAdminOs,
    handleInputErrors,
    DepartmentController.deleteDepartment)

export default router