import { Router } from 'express';
import { UserController } from '../controllers';
import isAuth from '../middlewares/isAuth';

const router = Router();

/**
 * @swagger
 * /user/me:
 *  get:
 *      tags:
 *         - User
 *      security:
 *          - bearerAuth: []
 *      description: Get user data based on the provided token in the header
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: Authorization
 *            in: header
 *            description: Bearer token
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: User data retrieved successfully
 *              content:
 *                 application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                          name:
 *                              type: string
 *                          lastName:
 *                              type: string
 *                          email:
 *                              type: string
 *                          role:
 *                              type: string
 *                          enabled:
 *                              type: boolean
 *                          lastSeenAt:
 *                              type: string
 *                          urlImage:
 *                              type: string
 *          401:
 *              description: Unauthorized
 */
router.get('/me', isAuth, UserController.getUserData);
router.get('/', UserController.userControllerTest);

/**
 * @swagger
 * /user/signup:
 *  post:
 *      tags:
 *          - User
 *      description: Create a new user
 *      requestBody:
 *          description: User object that needs to be added
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - lastName
 *                          - email
 *                          - password
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: Rafaella
 *                          lastName:
 *                              type: string
 *                              example: Carra
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: "rafaellacarra@example.com"
 *                          password:
 *                              type: string
 *                              format: password
 *                              example: "0303456lalala"
 *                          urlImage:
 *                              type: string
 *                              example: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Raffaella_Carr%C3%A0_2_%28cropped%29.jpg/800px-Raffaella_Carr%C3%A0_2_%28cropped%29.jpg"
 *      responses:
 *          201:
 *              description: User created successfully
 *          400:
 *              description: Bad request (missing fields or invalid data)
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *          409:
 *              description: Conflict (email already exists)
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *          500:
 *              description: Internal Server Error
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 */
router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);
router.post('/request-password-reset', UserController.requestPasswordReset);
router.post('/verify-reset-token', UserController.verifyResetToken);
router.post('/reset-password', UserController.resetPassword);

export { router as userRoutes };
