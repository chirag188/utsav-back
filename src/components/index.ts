import express from 'express'
import userRoute from '@user/route'
import health from '@middlewares/health'
const router = express.Router()

router.get('/user/health', health)
router.use('/user', userRoute)

export default router
