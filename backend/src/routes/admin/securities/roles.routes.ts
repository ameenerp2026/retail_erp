
import { Router } from 'express'
import { authMiddleware } from '../../../middleware/auth.middleware.js'
import { authorize } from '../../../middleware/authorize.js'

import {
  getRolesHandler,
  getRoleByIdHandler,
  createRoleHandler,
  updateRoleHandler,
  deleteRoleHandler,
  cloneRoleHandler,
} from '../../../controllers/admin/securities/roles.controller.js'

const router = Router()

router.use(authMiddleware)

router.get('/', authorize('ROLE_VIEW'), getRolesHandler)
router.get('/:id', authorize('ROLE_VIEW'), getRoleByIdHandler)

router.post('/', authorize('ROLE_CREATE'), createRoleHandler)
router.put('/:id', authorize('ROLE_EDIT'), updateRoleHandler)
router.delete('/:id', authorize('ROLE_DELETE'), deleteRoleHandler)

router.post('/:id/clone', authorize('ROLE_CREATE'), cloneRoleHandler)

export default router
