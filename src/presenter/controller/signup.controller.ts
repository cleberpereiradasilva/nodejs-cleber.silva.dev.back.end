import { Controller } from './protocols/controller'
import { httpResponse } from './protocols/httpResponse'
import { httpRequest } from './protocols/httpRequest'
import { badRequest } from './errors/badRequest'
import { invalidPassword } from './errors/invalidPassword'
import { invalidEmail } from './errors/invalidEmail'
import { EmailValidator } from './protocols/emailValidator'
import { PasswordValidator } from './protocols/passwordValidator'

export class SignupController implements Controller {
  constructor (private readonly validatorForEmail: EmailValidator,
    private readonly validatorForPassword: PasswordValidator) {
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

    if (!this.validatorForPassword.isValid(httpRequest.body.password)) {
      return invalidPassword()
    }

    return {
      statusCode: 200,
      body: ''
    }
  }
}
