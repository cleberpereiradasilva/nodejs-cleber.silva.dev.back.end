import {
  Controller,
  HttpResponse,
  HttpRequest,
  EmailValidator,
  PasswordValidator,
  CreateAccount
} from './protocols'

import {
  invalidParamError,
  serverError,
  invalidPasswordError,
  invalidEmailError
} from './errors'

export class SignupController implements Controller {
  constructor (private readonly validatorForEmail: EmailValidator,
    private readonly validatorForPassword: PasswordValidator,
    private readonly createAccount: CreateAccount) {
    this.validatorForEmail = validatorForEmail
  }

  handle (httpRequest: HttpRequest): HttpResponse {
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

      return this.createAccount.addAccount(httpRequest)
    } catch (error) {
      return serverError()
    }
  }
}
