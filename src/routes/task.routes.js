import express from 'express';
import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { createTaskValidator, updateTaskValidator } from '../validators/task.validator.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getTasks)
    .post(createTaskValidator, validate, createTask);

router.route('/:id')
    .get(getTask)
    .put(updateTaskValidator, validate, updateTask)
    .delete(deleteTask);

export default router;
