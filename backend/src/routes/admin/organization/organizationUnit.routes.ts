import express from 'express'
import  {
    createOrgUnitController,
    getOrgUnitByIdController,
    updateOrgUnitController,
    deleteOrgUnitController,
} from '../../../controllers/admin/organization/organizationUnit.controller.js'
import {authMiddleware }from '../../../middleware/auth.middleware.js'
const router= express.Router()
router.use(authMiddleware);
router.post('/org-unit',createOrgUnitController);
router.get('/org-unit/:id',getOrgUnitByIdController);
router.patch('/org-unit/:id',updateOrgUnitController);
router.delete('/org-unit/:id',deleteOrgUnitController);

export default router