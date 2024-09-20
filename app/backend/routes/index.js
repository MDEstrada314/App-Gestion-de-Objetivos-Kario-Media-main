import { Router } from "express";
import usuariosRouter from "./usuarios.routes.js";
import metasRouter from "./metas.routes.js";
import areasRouter from "./areas.routes.js";
import rolesRouter from "./roles.routes.js";
import authRouter from "./auth.routes.js";
import reportesRouter from "./reportes.routes.js";

export default function routesAPI (app){
  const router = Router();
  app.use('/api/v1', router);
  router.use('/usuarios', usuariosRouter);
  router.use('/metas', metasRouter);
  router.use('/areas', areasRouter);
  router.use('/roles', rolesRouter);
  router.use('/auth', authRouter);
  router.use('/reportes', reportesRouter);
}
