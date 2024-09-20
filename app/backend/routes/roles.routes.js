import { Router } from "express";
import * as service from "../controllers/roles.controllers.js";
import * as schemas from "../schemas/roles.schema.js";
import { validateSchema } from "../middlewares/joiValidator.js";
import verifyToken from "../middlewares/tokenValidator.js";
import isAdminRole from "../middlewares/isAdminRole.js";

const router = Router();

router.get("/", service.getRoles);
router.get(
  "/:id",
  [verifyToken, validateSchema(schemas.getRolesSchema, "params")],
  service.getOneRole
);

router.post(
  "/",
  [verifyToken, isAdminRole, validateSchema(schemas.createRolesSchema, "body")],
  service.createRole
);

router.patch(
  "/:id",
  [
    verifyToken,
    isAdminRole,
    validateSchema(schemas.getRolesSchema, "params"),
    validateSchema(schemas.updateRolesSchema, "body"),
  ],
  service.updateRole
);

router.delete(
  "/:id",
  [verifyToken, isAdminRole, validateSchema(schemas.getRolesSchema, "params")],
  service.deleteRole
);

export default router;
