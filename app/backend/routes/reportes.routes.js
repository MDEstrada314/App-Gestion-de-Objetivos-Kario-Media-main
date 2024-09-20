import { Router } from "express";
import * as service from "../controllers/reportes.controllers.js";
import verifyToken from "../middlewares/tokenValidator.js";
import isAdminRole from "../middlewares/isAdminRole.js";

const router = Router();

router.get('/', [verifyToken, isAdminRole], service.getReportes);
router.post('/', verifyToken, service.crearReporte);

export default router;