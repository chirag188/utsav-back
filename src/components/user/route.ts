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
	getFollowUpListApi,
	loginApi,
} from '@user/controller'

const router = Router()

router.post('/create', createUserApi)
router.put('/updateUser', createUserApi)
router.put('/updateSatsangProfile', createSatsangProfileApi)
router.post('/createSamparkVrund', createSamparkVrundApi)
router.get('/getAllSamparkVrund', getAllSamparkVrundAPI)
router.put('/assignSamparkKarykar', assignSamparkKarykarApi)
router.post('/createKarykarm', createKarykarmApi)
router.put('/followUpInitiate', followUpInitiateApi)
router.get('/getfollowUpList', getFollowUpListApi)
router.post('/login', loginApi)
router.get('/getAllSamparkKarykar', getAllSamparkKarykarAPI)
router.get('/getAllUser', getAllUserAPI)
router.get('/getAllKarykarm', getAllKarykarmAPI)
export default router
