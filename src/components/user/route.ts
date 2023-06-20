import { Router } from 'express'
import {
	assignSamparkKarykarApi,
	createKarykarmApi,
	createSamparkVrundApi,
	createSatsangProfileApi,
	createUserApi,
	followUpInitiateApi,
	getAllKarykarmAPI,
	getAllSamparkKarykarAPI,
	getAllSamparkVrundAPI,
	getAllUserAPI,
	getAttendanceListApi,
	getFollowUpDataApi,
	getFollowUpListApi,
	loginApi,
	updateFollowUpApi,
} from '@user/controller'
import authorize from '@middlewares/authorize'

const router = Router()

router.post('/login', loginApi)
router.use(authorize)
router.post('/create', createUserApi)
router.put('/updateUser', createUserApi)
router.put('/updateSatsangProfile', createSatsangProfileApi)
router.post('/createSamparkVrund', createSamparkVrundApi)
router.get('/getAllSamparkVrund', getAllSamparkVrundAPI)
router.put('/assignSamparkKarykar', assignSamparkKarykarApi)
router.post('/createKarykarm', createKarykarmApi)
router.put('/followUpInitiate', followUpInitiateApi)
router.get('/getfollowUpList', getFollowUpListApi)
router.get('/getAttendanceList', getAttendanceListApi)
router.get('/getFollowUpData', getFollowUpDataApi)
router.put('/updateFollowUp', updateFollowUpApi)
router.get('/getAllSamparkKarykar', getAllSamparkKarykarAPI)
router.get('/getAllUser', getAllUserAPI)
router.get('/getAllKarykarm', getAllKarykarmAPI)
export default router
