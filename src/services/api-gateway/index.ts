import {Services} from '~/constants/enums'
import config from '~/config'

export default class ApiGateway {
	public static async initiate(services: Services[]) {
		if (services.find(p => p === Services.app)) {
			const appApiGateway = require('./app').default

			await appApiGateway.initiate(config.appUrl, config.appPort)
		}
		if (services.find(p => p === Services.panel)) {
			const panelApiGateway = require('./panel').default

			await panelApiGateway.initiate(config.panelUrl, config.panelPort)
		}
	}
}