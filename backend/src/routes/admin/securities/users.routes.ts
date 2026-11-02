import { Router } from 'express'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import { authorize } from '../../../middleware/authorize.js'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
} from '../../../controllers/admin/securities/users.controller.js'

const router = Router()

router.get('/', authMiddleware, authorize('USER_VIEW'), getUsers)
router.get('/:id', authMiddleware, authorize('USER_VIEW'), getUserById)
router.post('/', authMiddleware, authorize('USER_CREATE'), createUser)
router.put('/:id', authMiddleware, authorize('USER_EDIT'), updateUser)
router.patch('/:id/status', authMiddleware, authorize('USER_EDIT'), updateUserStatus)



export default router