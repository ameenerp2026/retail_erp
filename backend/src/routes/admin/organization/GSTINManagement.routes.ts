import express from 'express'

import { authMiddleware } from '../../../middleware/auth.middleware.js'
import {
    creategstDetailsController,
    getGSTDetailsController
} from '../../../controllers/admin/organization/GSTINManagement.controller.js'
const router = express.Router()
router.use(authMiddleware);
router.post('/gst',creategstDetailsController);
router.get('/gst',getGSTDetailsController);

export default router