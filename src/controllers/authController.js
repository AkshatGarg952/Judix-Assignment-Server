import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError(400, 'Email is already registered'));
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        }
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        }
    });
});

export const getMe = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                createdAt: req.user.createdAt
            }
        }
    });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    });
});
