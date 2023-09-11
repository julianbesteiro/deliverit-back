"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const router = (0, express_1.Router)();
exports.userRoutes = router;
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
router.get('/me', isAuth_1.default, controllers_1.UserController.getUserData);
router.get('/', controllers_1.UserController.userControllerTest);
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
router.post('/signup', controllers_1.UserController.createUser);
router.post('/login', controllers_1.UserController.loginUser);
router.post('/logout', controllers_1.UserController.logoutUser);
router.post('/request-password-reset', controllers_1.UserController.requestPasswordReset);
router.post('/verify-reset-token', controllers_1.UserController.verifyResetToken);
router.post('/reset-password', controllers_1.UserController.resetPassword);
