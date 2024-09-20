import { Router } from "express";
import authController from "../controllers/auth.controllers.js";
import authSchema from "../schemas/auth.schema.js";
import { validateSchema } from "../middlewares/joiValidator.js";

const router = Router();

router.post("/", validateSchema(authSchema, "body"), authController);

export default router;
