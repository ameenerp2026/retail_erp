import express from "express";
import {getUOMS,createUOMS,updateUOM}from "../../../controllers/inventory/productSetup/uom.controller.js";
import {authMiddleware }from '../../../middleware/auth.middleware.js'
import { authorize } from "../../../middleware/authorize.js";


const router = express.Router();

router.use(authMiddleware);


router.get("/", authorize("UOM_VIEW"), getUOMS);
router.post("/", authorize("UOM_CREATE"), createUOMS);
router.patch("/:id/status", authorize("UOM_EDIT"), updateUOM);


export default router;
