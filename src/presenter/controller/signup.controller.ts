import { Controller } from './protocols/controller'
import { httpResponse } from './helpers/httpResponse'
import { httpRequest } from './helpers/httpRequest'

export class SignupController implements Controller {
  handle (httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email', 'password', 'confirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: ''
        }
      }
    }

    if (httpRequest.body.confirmation !== httpRequest.body.password) {
      return {
        statusCode: 400,
        body: ''
      }
    }

    return {
      statusCode: 200,
      body: ''
    }
  }
}
