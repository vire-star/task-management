import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { acceptInvitation, addMemberToWorkshop, createWorkshop, deleteWorkshop, getAllWorkshop, getInvitedWorkshops, getMyCreatedWorkshops, getSingleWorkshop, getTotalMemberInWorkShop, leaveWorkshop, removeUserFromWorkshop } from '../controller/workshop.controller.js'


const workShopRoute = express.Router()

workShopRoute.post('/createWorkshop', authMiddleware, createWorkshop)
workShopRoute.get('/getAllWorkshop', authMiddleware, getAllWorkshop)
workShopRoute.get('/getMyWorkshop', authMiddleware, getMyCreatedWorkshops)
workShopRoute.get('/getInvitedWorkshop', authMiddleware, getInvitedWorkshops)
workShopRoute.get('/getSingleWorkshop/:id', authMiddleware, getSingleWorkshop)
workShopRoute.post('/inviteMember/:id', authMiddleware, addMemberToWorkshop)
workShopRoute.post('/acceptInvitation/:id', authMiddleware, acceptInvitation)
workShopRoute.get('/getTotalMember/:id', authMiddleware, getTotalMemberInWorkShop)
workShopRoute.delete('/deleteWorkshop/:id', authMiddleware, deleteWorkshop)
workShopRoute.delete('/leaveWorkshop/:id', authMiddleware, leaveWorkshop)
workShopRoute.post('/removeUserFromWorkshop/:id', authMiddleware, removeUserFromWorkshop)

export default workShopRoute