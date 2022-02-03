import { Controller } from './protocols/controller'
import { httpResponse } from './helpers/httpResponse'

export class SignupController implements Controller {
  handle (): httpResponse {
    return {
      statusCode: 200,
      body: ''
    }
  }
}
