import { Router } from 'express'
import {
	assignSamparkKarykarApi,
	createKarykarmApi,
	createSamparkVrundApi,
	createSatsangProfileApi,
	createUserApi,
	followUpInitiateApi,
	getAllSamparkVrundAPI,
	getFollowUpListApi,
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
export default router
