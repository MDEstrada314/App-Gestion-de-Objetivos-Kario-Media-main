import { Router } from "express";
import * as service from "../controllers/usuarios.controllers.js";
import { validateSchema } from "../middlewares/joiValidator.js";
import * as schemas from "../schemas/usuario.schema.js";
import verifyToken from "../middlewares/tokenValidator.js";
import isAdminRole from "../middlewares/isAdminRole.js";
import upload from "../middlewares/multer.js";
const router = Router();

router.get("/", service.getUsuarios);

router.get("/no-admin", verifyToken, service.getNoAdmins); 
router.get(
  "/:id",
[verifyToken, validateSchema(schemas.getUsuarioSchema, "params")], 
  service.getOneUsuario
);
router.post(
  "/",
  [
    verifyToken,
    isAdminRole,
    validateSchema(schemas.createUsuarioSchema, "body"),
  ],
  service.createUsuario
);
router.post(
  "/photo/:id",
  [
    verifyToken,
    isAdminRole,
    validateSchema(schemas.getUsuarioSchema, "params"),
    upload.single("image"),
    validateSchema(schemas.añadirPhoto, "body"),
  ],
  service.createImage
);
router.patch(
  "/:id",
  [verifyToken, validateSchema(schemas.getUsuarioSchema, "params")],
  service.updateUsuario
),
  router.patch(
    "/updatePhoto/:id",
    [verifyToken, upload.single("image")],
    service.updateImage
  );
router.delete(
  "/:id",
  [
    verifyToken,
    isAdminRole,
    validateSchema(schemas.getUsuarioSchema, "params"),
  ],
  service.deleteUsuario
);

export default router;
