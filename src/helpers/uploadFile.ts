var AWS = require('aws-sdk')
var fs = require('fs')
// Set the region
AWS.config.update({ region: 'us-west-2' })

// Create S3 service object

const uploadImageToS3 = async (profilePic: any, keyname: string) => {
	try {
		var s3 = new AWS.S3({
			apiVersion: '2006-03-01',
			accessKeyId: process.env.ACCESS_KEY,
			secretAccessKey: process.env.SECRET_ACCESS_KEY,
		})
		var uploadParams = {
			Bucket: process.env.BUCKET,
			Key: '',
			Body: '',
			'Content-Type': 'image/jpg',
		}
		// var fileStream = fs.createReadStream('src/helpers/cat-3.jpg')
		// fileStream.on('error', function (err) {
		// 	console.log('File Error', err)
		// })
		uploadParams.Body = profilePic
		// uploadParams.Body = fileStream
		// var path = require('path')
		// uploadParams.Key = path.basename('cat-6.jpg')
		uploadParams.Key = keyname

		// call S3 to retrieve upload file to specified bucket
		// const data = await s3.upload(uploadParams)
		// console.log({ location: data.location })
		const data = await s3.upload(uploadParams).promise()
		// , function (err, data) {
		// 	if (err) {
		// 		return ''
		// 	}
		// 	if (data) {
		// 		console.log('Upload Success', data.Location)
		// 		return data.location
		// 	} else {
		// 		return ''
		// 	}
		// })
		return data.Location
	} catch (err) {
		console.log({ err })
		return 'aggs'
	}
}

export default uploadImageToS3
