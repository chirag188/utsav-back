import { Router } from 'express'
import {
	assignSamparkKarykarApi,
	createKarykarmApi,
	createSamparkVrundApi,
	updateSatsangProfileApi,
	createUserApi,
	deleteUserApi,
	followUpInitiateApi,
	getAllKarykarmAPI,
	getAllSamparkKarykarAPI,
	getAllSamparkVrundAPI,
	getAllUserAPI,
	getAttendanceListApi,
	getFollowUpDataApi,
	getFollowUpListApi,
	getProfileDataApi,
	loginApi,
	updateFollowUpApi,
	uploadImageApi,
	wakeUpApi,
	changeAttendanceApi,
	deleteKarykarmApi,
} from '@user/controller'
import authorize from '@middlewares/authorize'

const router = Router()

router.get('/wakeUp', wakeUpApi)
router.post('/login', loginApi)
router.use(authorize)
router.post('/create', createUserApi)
router.put('/updateUser', createUserApi)
router.post('/uploadImage', uploadImageApi)
router.put('/updateSatsangProfile', updateSatsangProfileApi)
router.post('/createSamparkVrund', createSamparkVrundApi)
router.get('/getAllSamparkVrund', getAllSamparkVrundAPI)
router.put('/assignSamparkKarykar', assignSamparkKarykarApi)
router.put('/deleteUser', deleteUserApi)
router.post('/createKarykarm', createKarykarmApi)
router.post('/deleteKarykarm', deleteKarykarmApi)
router.put('/followUpInitiate', followUpInitiateApi)
router.get('/getfollowUpList', getFollowUpListApi)
router.get('/getAttendanceList', getAttendanceListApi)
router.get('/getFollowUpData', getFollowUpDataApi)
router.get('/getProfileData', getProfileDataApi)
router.put('/updateFollowUp', updateFollowUpApi)
router.put('/changeAttendance', changeAttendanceApi)
router.get('/getAllSamparkKarykar', getAllSamparkKarykarAPI)
router.get('/getAllUser', getAllUserAPI)
router.get('/getAllKarykarm', getAllKarykarmAPI)
export default router
