// Node Modules
userRouter = require('express').Router()

// File Modules
const userController = require('../controllers/UserController.js');
const { isAdmin, verifyToken } = require('../middlewares/authMiddleware.js');

userRouter.get('/profile', verifyToken, userController.getMyProfile);

userRouter.post('/', userController.registerUser);
userRouter.post('/login', userController.authUser);

userRouter.patch('/update', verifyToken, userController.updateProfile);
userRouter.patch('/update-password', verifyToken, userController.updatePassword);

export default userRouter;