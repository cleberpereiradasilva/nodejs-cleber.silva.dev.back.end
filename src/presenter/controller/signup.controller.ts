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
  invalidEmailError,
  success
} from './http-helpers'

import {
  AccountModel
} from '../../domain/models'

export class SignupController implements Controller {
  constructor (private readonly validatorForEmail: EmailValidator,
    private readonly validatorForPassword: PasswordValidator,
    private readonly createAccount: CreateAccount) {
    this.validatorForEmail = validatorForEmail
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const account: AccountModel = await this.createAccount.addAccount({
        password, email, name
      })

      return await new Promise(resolve => resolve(success(account)))
    } catch (error) {
      return serverError()
    }
  }
}
