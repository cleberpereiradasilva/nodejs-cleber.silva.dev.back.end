import { Controller } from './protocols/controller'
import { httpResponse } from './protocols/httpResponse'
import { httpRequest } from './protocols/httpRequest'
import { invalidParamError } from './errors/invalidParamError'
import { serverError } from './errors/serverError'
import { invalidPasswordError } from './errors/invalidPasswordError'
import { invalidEmailError } from './errors/invalidEmailError'
import { EmailValidator } from './protocols/emailValidator'
import { PasswordValidator } from './protocols/passwordValidator'

export class SignupController implements Controller {
  constructor (private readonly validatorForEmail: EmailValidator,
    private readonly validatorForPassword: PasswordValidator) {
    this.validatorForEmail = validatorForEmail
  }

  handle (httpRequest: httpRequest): httpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return invalidParamError(field)
        }
      }
      if (httpRequest.body.confirmation !== httpRequest.body.password) {
        return invalidParamError('confirmation')
      }

      if (!this.validatorForEmail.isValid(httpRequest.body.email)) {
        return invalidEmailError()
      }

      if (!this.validatorForPassword.isValid(httpRequest.body.password)) {
        return invalidPasswordError()
      }

      return {
        statusCode: 200,
        body: ''
      }
    } catch (error) {
      return serverError()
    }
  }
}
