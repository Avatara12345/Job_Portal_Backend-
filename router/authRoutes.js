const express = require('express');
const { body } = require('express-validator');
const { signup, login ,getAllUser } = require('../controller/authController');

const router = express.Router();

router.post(
	'/signup',
	[
		body('name').isString().trim().notEmpty().withMessage('Name is required'),
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').notEmpty().withMessage('Password must required'),
		body('role').optional().isIn(['user','admin']).withMessage('Invalid role')
	],
	signup
);

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').exists().withMessage('Password is required')
	],
	login
);

  router.get('/users',async (req,res) => {
	 return await getAllUser (req,res)
  })
module.exports = router;


