import { Controller } from './protocols/controller'
import { httpResponse } from './protocols/httpResponse'
import { httpRequest } from './protocols/httpRequest'
import { badRequest } from './errors/badRequest'
import { invalidEmail } from './errors/invalidEmail'
import { EmailValidator } from './protocols/emailValidator'

export class SignupController implements Controller {
  constructor (private readonly validatorForEmail: EmailValidator) {
    this.validatorForEmail = validatorForEmail
  }

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

    if (!this.validatorForEmail.isValid(httpRequest.body.email)) {
      return invalidEmail()
    }

    return {
      statusCode: 200,
      body: ''
    }
  }
}
