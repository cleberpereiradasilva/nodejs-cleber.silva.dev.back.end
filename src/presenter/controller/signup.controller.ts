import { Controller } from './protocols/controller'
import { httpResponse } from './helpers/httpResponse'
import { httpRequest } from './helpers/httpRequest'

export class SignupController implements Controller {
  handle (httpRequest: httpRequest): httpResponse {
    return {
      statusCode: 200,
      body: ''
    }
  }
}
