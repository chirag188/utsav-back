import { config } from 'dotenv'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'
import fs from 'fs'

config()

const credentials = fromNodeProviderChain({
	clientConfig: {
		region: process.env.AWS_DEFAULT_REGION,
	},
})

;(async () => {
	console.log('Inside loadSecrets')
	try {
		const client = new SecretsManagerClient({
			region: process.env.AWS_DEFAULT_REGION,
			credentials,
		})

		const secretsRes = await client.send(
			new GetSecretValueCommand({
				SecretId: process.env.SECRET_ID,
				VersionStage: 'AWSCURRENT',
			})
		)

		if (!secretsRes.SecretString) throw new Error('Unable to load secret keys')

		const secrets = JSON.parse(secretsRes.SecretString!)

		let env = ''

		Object.keys(secrets).map((key) => {
			env += `${key}="${secrets[key]}"\n`
		})

		fs.writeFileSync(`${process.env.ENV_FILE}.env`, env)
		console.log('ENV Loaded')
	} catch (err) {
		console.log(`Error Loading secrets ${err}`)
	}
})()
