import { Router } from "express";
import { body, param } from "express-validator"
import { RoomsController } from "../controllers/RoomsController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate, authorizationAdminOs, authorizationManager } from "../middleware/auth";
import { roomIdExists, roomNameExists } from "../middleware/room";
import { userRolIsAdmin } from "../middleware/role";

const router = Router()

router.use(authenticate)

router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre de la sala es Obligatoria'),
    authorizationAdminOs,
    roomNameExists,
    handleInputErrors,
    RoomsController.createRoom)
router.post('/schedule',
    body('reason')
    .notEmpty().withMessage('La razón es obligatoria'),
    handleInputErrors,
    RoomsController.createRoomSchedule)
    
router.get('/', RoomsController.getAllRooms)
router.get('/schedules', RoomsController.getAllRoomsSchedules)
router.get('/schedules/all', RoomsController.getAllReservedRoomsSchedules)

router.get('/:id',
    param('id').isInt().withMessage('El ID no es Valido'),
    handleInputErrors,
    RoomsController.getRoomById)

router.param('room_id', roomIdExists)
router.get('/:id', RoomsController.getRoomByParams)

router.put('/:room_id',
    param('room_id').isInt().withMessage('El ID no es Valido'),
    body('name')
        .notEmpty().withMessage('El nombre de la sala es Obligatoria'),
    authorizationAdminOs,
    handleInputErrors,
    RoomsController.updateRoom)

router.delete('/:room_id',
    param('room_id').isInt().withMessage('El ID no es Valido'),
    authorizationAdminOs,
    handleInputErrors,
    RoomsController.deleteRoom)
export default router