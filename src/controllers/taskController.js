import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createTask = asyncHandler(async (req, res, next) => {
    const { title, description, status, priority } = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        data: { task }
    });
});

export const getTasks = asyncHandler(async (req, res, next) => {
    const { status, priority, search, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (status) {
        query.status = status;
    }

    if (priority) {
        query.priority = priority;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
        success: true,
        data: {
            tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }
    });
});

export const getTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!task) {
        return next(new ApiError(404, 'Task not found'));
    }

    res.status(200).json({
        success: true,
        data: { task }
    });
});

export const updateTask = asyncHandler(async (req, res, next) => {
    const { title, description, status, priority } = req.body;

    let task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!task) {
        return next(new ApiError(404, 'Task not found'));
    }

    task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, status, priority },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: { task }
    });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!task) {
        return next(new ApiError(404, 'Task not found'));
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
    });
});
