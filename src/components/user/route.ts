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
	getAllSevaAPI,
	getAttendanceReportAPI,
	// genrateKarykarmReportAPI,
	deleteSamparkVrundApi,
	getSamparkVrundApi,
	// updateSamparkVrundApi,
	getUpcomingBirthdayListAPI,
	bulkAttendanceApi,
	createSocApi,
	getCustomSocApi,
	deleteSocApi,
	migrateSocApi,
	getKarykarmAPI,
	forgotPasswordApi,
	verifyForgotPasswordOtpApi,
	updatePasswordApi,
} from '@user/controller'
import authorize from '@middlewares/authorize'

const router = Router()

router.get('/wakeUp', wakeUpApi)
router.post('/login', loginApi)
router.post('/forgotPassword', forgotPasswordApi)
router.post('/verifyForgotPasswordOtp', verifyForgotPasswordOtpApi)
router.post('/updatePassword', updatePasswordApi)
router.use(authorize)
router.post('/create', createUserApi)
router.put('/updateUser', createUserApi)
router.post('/uploadImage', uploadImageApi)
router.put('/updateSatsangProfile', updateSatsangProfileApi)
router.post('/createSamparkVrund', createSamparkVrundApi)
// router.post('/upd/ateSamparkVrund', updateSamparkVrundApi)
router.get('/getSamparkVrund', getSamparkVrundApi)
router.post('/deleteSamparkVrund', deleteSamparkVrundApi)
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
router.post('/bulkAttendance', bulkAttendanceApi)
router.get('/getAllSamparkKarykar', getAllSamparkKarykarAPI)
router.get('/getAllUser', getAllUserAPI)
router.get('/getAttendanceReport', getAttendanceReportAPI)
router.get('/getAllKarykarm', getAllKarykarmAPI)
router.get('/getKarykarm', getKarykarmAPI)
// router.get('/genrateKarykarmReport', genrateKarykarmReportAPI)
router.get('/getAllSeva', getAllSevaAPI)
router.get('/getUpcomingBirthdayList', getUpcomingBirthdayListAPI)

// society routes can be added here
router.get('/society', getCustomSocApi)
router.post('/society', createSocApi)
router.put('/society', createSocApi)
router.delete('/society', deleteSocApi)
router.get('/migrateSoc', migrateSocApi)

export default router
