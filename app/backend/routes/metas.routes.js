import { Router } from "express";
import { validateSchema } from "../middlewares/joiValidator.js";
import * as schemas from "../schemas/metas.schema.js";
import * as service from "../controllers/metas.controllers.js";
import verifyToken from "../middlewares/tokenValidator.js";
import isAdminRole from "../middlewares/isAdminRole.js";

const router = Router();

router.get("/", service.getMetas);
router.delete("/:id", service.deleteMeta);


router.get(
  "/porcentaje/:id",
  [verifyToken, validateSchema(schemas.getMetasSchema, "params")],
  service.getPorcentajeCheck
);
router.get(
  "/:id",
  [verifyToken, validateSchema(schemas.getMetasSchema, "params")],
  service.getOneMeta
);

router.post(
  "/add-tasks/:id",
  [
    verifyToken,
    validateSchema(schemas.getMetasSchema, "params"),
    validateSchema(schemas.añadirTareas, "body"),
  ],
  service.añadirTareas
);

router.post(
  "/",
  [verifyToken, isAdminRole, validateSchema(schemas.createMetasSchema, "body")],
  service.createMeta
);

router.patch(
  "/:id",
  [verifyToken, isAdminRole, validateSchema(schemas.updateMetasSchema, "body")],
  service.editarMeta
);




export default router;
