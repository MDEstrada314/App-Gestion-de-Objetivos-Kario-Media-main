/**
 * @swagger
 * components:
 *   parameters:
 *     jwtAdmin:
 *       in: header
 *       name: x-auth-token-admin
 *       required: true
 *       description: JWT obtenido en la autenticación. El usuario debe tener rol ADMIN.
 *       schema:
 *         type: string
 *     jwtUser:
 *       in: header
 *       name: x-auth-token-user
 *       required: true
 *       description: JWT obtenido en la autenticación. No importa el rol del usuario.
 *       schema:
 *         type: string
 *   responses:
 *     NotFound:
 *       description: (NotFound) no se encontró la información
 *     BadRequest:
 *       description: (BadRequest) Los datos enviados son incorrectos o hay datos obligatorios no enviados
 *     ServerError:
 *       description: Error en el servidor
 *   schemas:
 *     AreaPost:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: Marketing
 *         estado:
 *           type: boolean
 *           default: true
 *     MetaPost:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           uniqueItems: true
 *           example: Marketing
 *         descripcion:
 *           type: string
 *         dificultad:
 *           type: string
 *           enum:
 *             - Alta
 *             - Media
 *             - Baja
 *           example: Alta
 *         fechaInicio: 
 *           type: string
 *           format: date
 *           example: 1990-01-01
 *         fechaFinal:
 *           type: string
 *           format: date
 *           example: 1990-01-01
 *         metodologia:
 *           type: string
 *         area: 
 *           type: string
 *           format: objectId
 *           pattern: '^[0-9a-fA-F]+$'
 *           maxLength: 24
 *           minLength: 24
 *           example: 05c4d36a2cfde067c6c266d
 *         tareas:
 *           type: array
 *         cumplimiento:
 *           type: number
 *           default: 0
 *     TareasPost: 
 *       type: object
 *       properties:
 *         titulo: 
 *           type: string
 *         instrucciones:
 *           type: string
 *         tiempoHoras: 
 *           type: number
 *           minimum: 1
 *         integrantes:
 *           type: object
 *           properties:
 *             usuario:
 *               type: string
 *               format: objectId
 *               pattern: '^[0-9a-fA-F]+$'
 *               maxLength: 24
 *               minLength: 24
 *               example: 05c4d36a2cfde067c6c266d
 *     RolPost:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           uniqueItems: true
 *           pattern: '^[A-Z]+$'
 *           example: 'ADMIN'
 *         estado:
 *           type: boolean
 *           default: true
 *     UsuarioPost:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           uniqueItems: true
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 20
 *           pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).*$'
 *           example: Password123!
 *         email:
 *           type: string
 *           format: email
 *           example: allhired@example.com
 *         estado:
 *           type: boolean
 *           default: true
 *         rol: 
 *           type: array
 *           items:
 *             type: string
 *             format: uppercase
 *             example: USER
 *         notificacion:
 *           type: array
 *           items: 
 *             type: object
 *             properties:
 *               mensaje:
 *                 type: string
 *               estado:
 *                 type: boolean
 *     AuthPost:
 *       type: object
 *       properties:
 *         email: 
 *           type: string
 *           format: email
 *           example: allhired@example.com
 *         contraseña:
 *           type: string
 *           minLength: 8
 *           maxLength: 20
 *           pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).*$'
 *           example: Password123!
 */

/**
 * @swagger
 * /api/v1/areas/{idArea}:
 *   get:
 *     tags:
 *       - Area
 *     summary: Obtiene un único registro de área
 *     description: Obtiene la información única de un área en la base de datos
 *     parameters:
 *       - name: idArea
 *         in: path
 *         description: Identificador del área que se desea obtener
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           pattern: '^[0-9a-fA-F]+$'
 *           minLength: 24
 *           maxLength: 24
 *           example: 605c4d36a2cfde067c6c266d
 *       - $ref: '#/components/parameters/jwtUser'
 *     responses:
 *       200:
 *         description: (OK) La información del área se obtuvo con éxito
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 *   patch:
 *     tags:
 *       - Area
 *     summary: Actualiza la información de un área en la base de datos
 *     parameters:
 *       - name: idArea
 *         in: path
 *         description: Identificador del área que se desea actualizar
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           pattern: '^[0-9a-fA-F]+$'
 *           minLength: 24
 *           maxLength: 24
 *           example: 605c4d36a2cfde067c6c266d
 *       - $ref: '#/components/parameters/jwtAdmin'
 *     requestBody:
 *       description: Datos a modificar en el área
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AreaPost"
 *     responses:
 *       200:
 *         description: (OK) La información del área se actualizó con éxito
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 *   delete:
 *     tags:
 *       - Area
 *     summary: Elimina un área de la base de datos
 *     parameters:
 *       - name: idArea
 *         in: path
 *         description: Identificador del área que se desea eliminar
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           pattern: '^[0-9a-fA-F]+$'
 *           minLength: 24
 *           maxLength: 24
 *           example: 605c4d36a2cfde067c6c266d
 *       - $ref: '#/components/parameters/jwtAdmin'
 *     responses:
 *       200:
 *         description: (OK) El área fue eliminada exitosamente
 *       400:
 *         $ref: "#/components/responses/BadRequest"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */

