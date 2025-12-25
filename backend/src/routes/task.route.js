import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { assignUserToTask, changeStatus, createTask, deleteTask, getAllTask, getSingleTask, getTasksAssignedToUser } from '../controller/task.controller.js'
// onlyWorkshopOwner,.middleware.js'
import { resolveWorkshopFromTask } from '../middleware/task.middleware.js'
import { onlyWorkshopOwner, onlyWorkshopOwnerForTaskCreate } from '../middleware/workshop.middleware.js'


const taskRoute = express.Router()


taskRoute.post('/createTask/:id', authMiddleware, onlyWorkshopOwnerForTaskCreate, createTask)
taskRoute.get('/getAllTask/:id', authMiddleware, getAllTask)
taskRoute.get('/getSingleTask/:id', authMiddleware,  getSingleTask)
taskRoute.get('/getUserAssignedTask/:id', authMiddleware,  getTasksAssignedToUser)
taskRoute.delete('/delteTask/:id', authMiddleware,  onlyWorkshopOwner, deleteTask)
taskRoute.post('/assignToTask/:id', authMiddleware,  onlyWorkshopOwner, assignUserToTask)
taskRoute.post('/changeTaskStatus/:id', authMiddleware, onlyWorkshopOwner, changeStatus)


export default taskRoute