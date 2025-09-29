const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schema/User');
const { application } = require('express');

const signToken = (userId, role) => {
	const secret = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
	return jwt.sign({ sub: userId, role }, secret, { expiresIn });
};

const signup = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password, role } = req.body;

		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: 'Email already in use' });
		}

		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		const user = await User.create({ name, email, passwordHash, role });
		const token = signToken(user._id, user.role);

		return res.status(201).json({
			message: 'User registered successfully',
			user: { id: user._id, name: user.name, email: user.email, role: user.role },
			token
		});
	} catch (error) {
		console.error('Signup error:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

const login = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const token = signToken(user._id, user.role);
		return res.status(200).json({
			message: 'Login successful',
			user: { id: user._id, name: user.name, email: user.email, role: user.role },
			token
		});
	} catch (error) {
		console.error('Login error:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};
 
const getAllUser =async(req,res)=>{
	try{
		const users = await User.find({}).sort({ createdAt: -1 });

		if(!users){
			return res.status(404).json({message:"User not found "})
		}
		return res.status(200).json({Users:users})
	}catch(err){
      return res.status(500).json({message:'Internal server error', err:err.message})
	}
	
}

module.exports = { signup, login,getAllUser };
