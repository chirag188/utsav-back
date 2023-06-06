import { Router } from 'express'
import {
	createSamparkVrundApi,
	createSatsangProfileApi,
	createUserApi,
	getAllSamparkVrundAPI,
	// login,
	// verifyLogin,
	// forgotPassword,
	// resetPassword,
	// updateUser,
	// sendEmailOtp,
	// getUser,
	// getAllUser,
	// updateUserStatus,
	// getUserByAuth,
	// createNewUser,
	// newUserLogin,
	// userVerifyLogin,
	// logout,
	// resendRequest,
} from '@user/controller'
// import Authorize from '@middlewares/authorize'
// import checkIsAdmin from '@middlewares/checkIsAdmin'
// import checkOTPLimit from '@middlewares/checkOTPLimit'
// import checkPasswordChanged from '@middlewares/checkPasswordChanged'

const router = Router()

router.post('/create', createUserApi)
router.put('/updateUser', createUserApi)
router.put('/updateSatsangProfile', createSatsangProfileApi)
router.post('/createSamparkVrund', createSamparkVrundApi)
router.get('/getAllSamparkVrund', getAllSamparkVrundAPI)
// router.post('/verify', verifyLogin)
// router.post('/emailOtp', checkOTPLimit, sendEmailOtp)
// router.post('/forgotPassword', checkOTPLimit, forgotPassword)
// router.put('/resetPassword', resetPassword)
// router.post('/new-user', createNewUser)
// router.post('/user-login', newUserLogin)
// router.post('/userVerifyLogin', userVerifyLogin)
// router.use(Authorize)
// router.use(checkPasswordChanged)
// router.get('/getUser/:userId', checkIsAdmin, getUser)
// router.get('/getAllUser', checkIsAdmin, getAllUser)
// router.put('/updateUserStatus/:userId', checkIsAdmin, updateUserStatus)
// router.get('/getUserProfile', getUserByAuth)
// router.post('/resend-email', resendRequest)
// router.get('/logout', logout)
// router.put('/updateBankDetail', updateBankDetail)
// router.put('/updateACHBankDetail', updateACHBankDetail)
// router.post('/verifyEmail', verifyEmail)
// router.post('/sendKYBVerificationEmail', sendKYBVerificationEmail)
// router.get('/:userId/device/:deviceId/isValid', checkUserDeviceValid)
// router.post('/send-mobileOtp', checkOTPLimit, sendOtpToMobile)
// router.post('/kybWebhook', sumsubKyBWebhook)
// router.get('/kybAccessToken/:id', getSumSubAccessToken)
// router.delete('/device', deleteDeviceFromToken)

// router.get('/userAgreement/:id', getSignedDoc)
// router.get('/ERTCAAgreement/:id', getERTCADoc)

// router.get('/echo', checkIsAdmin, getEchoUsers)
// router.patch('/echo/:userId', checkIsAdmin, updateEchoUser)
// router.get('/echo/subscriber-count', getEchoSubscriberCount)
// router.post('/echo', checkIsAdmin, createEchoUser)
// router.put('/updateAgreement/:id', checkIsAdmin, updateAgreement)
// router.put('/resetKYBAttempts/:id', checkIsAdmin, resetKYBAttempts)
// router.post('/sendEmails', checkIsAdmin, sendBulkEmails)

// router.put('/updateMobile', checkOTPLimit, sendMobileotp)
// router.post('/verifyMobile', verifyMobileNo)
// router.get('/accountProgress', accountProgress)
// router.post('/createBankAccount', createBankAccount)
// router.get('/getBankAccount/:type', getBankAccount)
// router.post('/createWallet', createWallet)
// router.post('/createACHBankAccount', createACHBankAccount)
// router.put('/deleteBankAccount/:accountId', deleteBankAccount)
// router.patch('/price-updated-date', updatePriceLastUpdated)
// router.post('/twoFA-request', twoFAUpdateRequest)
// router.post('/verify-twoFA', verifySecurityUpdate)
// router.get('/create-wallet/caxton', createCaxtonWallet)
// router.get('/create-wallet/blockchain', createBlockchainwallet)
// router.get('/devices', getAllDevices)
// router.delete('/devices/:id', deleteDevice)
// router.get('/userKycDetails', getApplicantDetails)
// router.get('/getERTCADocUrl', getERTCADocUrl)
// router.post('/ertcaSigned', ertcaSigned)
// router.get('/generateKybLink/:id', checkIsAdmin, generateKybLink)
export default router
