const express = require('express');
const upload = require('../multer/multer');
const { getUsers, getUserById, updateUser } = require('../controller/UserController');
const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', upload.single('avatar'), updateUser);

module.exports = router;