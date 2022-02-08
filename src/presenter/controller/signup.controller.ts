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

import {
  AccountModel
} from '../../domain/model'

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
      const { password, email, name } = httpRequest.body

      if (httpRequest.body.confirmation !== password) {
        return invalidParamError('confirmation')
      }

      if (!this.validatorForEmail.isValid(email)) {
        return invalidEmailError()
      }

      if (!this.validatorForPassword.isValid(password)) {
        return invalidPasswordError()
      }
      const account: AccountModel = this.createAccount.addAccount({
        password, email, name
      })

      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}
