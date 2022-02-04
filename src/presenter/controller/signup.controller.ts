import { Controller } from './protocols/controller'
import { httpResponse } from '../helpers/httpResponse'
import { httpRequest } from '../helpers/httpRequest'
import { badRequest } from '../errors/badRequest'

export class SignupController implements Controller {
  handle (httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name', 'email', 'password', 'confirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(field)
      }
    }
    if (httpRequest.body.confirmation !== httpRequest.body.password) {
      return badRequest('confirmation')
    }

    return {
      statusCode: 200,
      body: ''
    }
  }
}
