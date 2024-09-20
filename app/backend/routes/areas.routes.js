import { Router } from "express";
import * as service from "../controllers/areas.controllers.js";
import * as schemas from "../schemas/areas.schema.js";
import { validateSchema } from "../middlewares/joiValidator.js";
import verifyToken from "../middlewares/tokenValidator.js";
import isAdminRole from "../middlewares/isAdminRole.js";

const router = Router();

router.get("/", service.getAreas);
router.get(
  "/:id",
  [verifyToken, validateSchema(schemas.getAreaSchema, "params")],
  service.getAreas
);

router.post(
  "/",
  [verifyToken, isAdminRole, validateSchema(schemas.createAreaSchema, "body")],
  service.createArea
);

router.patch(
  "/:id",
  [
    verifyToken,
    isAdminRole,
    validateSchema(schemas.getAreaSchema, "params"),
    validateSchema(schemas.updateAreaSchema, "body"),
  ],
  service.updateArea
);

router.delete(
  "/:id",
  [verifyToken, isAdminRole, validateSchema(schemas.getAreaSchema, "params")],
  service.deleteArea
);

export default router;
