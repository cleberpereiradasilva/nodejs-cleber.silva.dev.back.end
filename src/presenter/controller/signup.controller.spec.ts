import { SignupController } from './signup.controller'
import {
  Controller,
  PasswordValidator,
  EmailValidator,
  CreateAccount
} from './protocols'

import {
  AccountModel,
  CreateAccountModel
} from '../../domain/model'

import {
  invalidParamError,
  serverError,
  invalidEmailError,
  invalidPasswordError
} from './errors/'

describe('Signup Controller', () => {
  interface sutType {
    sut: Controller
    validatorForEmailStub: EmailValidator
    validatorForPasswordStub: PasswordValidator
    createAccountStub: CreateAccount
  }

  class ValidatorForEmail implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  class ValidatorForPassword implements PasswordValidator {
    isValid (password: string): boolean {
      return true
    }
  }

  class CreateAccountStub implements CreateAccount {
    addAccount = (createAccountModel: CreateAccountModel): AccountModel => {
      const fackeAccount = { ...createAccountModel, id: 'valid_id' }
      return fackeAccount
    }
  }

  const makeSut = (): sutType => {
    const validatorForEmailStub = new ValidatorForEmail()
    const validatorForPasswordStub = new ValidatorForPassword()
    const createAccountStub = new CreateAccountStub()
    const sut = new SignupController(validatorForEmailStub,
      validatorForPasswordStub,
      createAccountStub)
    return {
      sut,
      validatorForEmailStub,
      validatorForPasswordStub,
      createAccountStub
    }
  }
  it('Should return 400 when no provide name', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        email: 'valid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('name'))
  })
  it('Should return 400 when no provide email', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'valid_name',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('email'))
  })

  it('Should return 400 when no provide password', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('password'))
  })

  it('Should return 400 when no provide confirmation', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('confirmation'))
  })

  it('Should return 400 when password is diferente of confirmation', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmation: 'invalid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('confirmation'))
  })

  it('Should correct email be called in EmailValidator', () => {
    const { sut, validatorForEmailStub } = makeSut()
    const isValidMock = jest.spyOn(validatorForEmailStub, 'isValid')
    sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(isValidMock).toBeCalledWith('valid_email')
  })

  it('Should return 400 when email is not a valid email', () => {
    const { sut, validatorForEmailStub } = makeSut()
    jest.spyOn(validatorForEmailStub, 'isValid').mockReturnValueOnce(false)
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'invalid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidEmailError())
  })

  it('Should correct password be called in PasswordValidator', () => {
    const { sut, validatorForPasswordStub } = makeSut()
    const isValidMock = jest.spyOn(validatorForPasswordStub, 'isValid')
    sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(isValidMock).toBeCalledWith('valid_password')
  })

  it('Should return 400 when password is not a valid password', () => {
    const { sut, validatorForPasswordStub } = makeSut()
    jest.spyOn(validatorForPasswordStub, 'isValid').mockReturnValueOnce(false)
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'invalid_email',
        password: 'invalid_password',
        confirmation: 'invalid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidPasswordError())
  })

  it('Should Exception when ValidatorForEmail return a Exception', () => {
    const { sut, validatorForPasswordStub } = makeSut()
    jest.spyOn(validatorForPasswordStub, 'isValid').mockImplementation(() => {
      throw Error()
    })
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'invalid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(500)
    expect(response).toEqual(serverError())
  })

  it('Should call addAccount with correct data', () => {
    const { sut, createAccountStub } = makeSut()
    const addAccountMock = jest.spyOn(createAccountStub, 'addAccount')
    const request = {
      body: {
        name: 'valid_name',
        email: 'invalid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(200)
    expect(response.body.id).not.toBeNull()
    const { name, email, password } = request.body
    expect(addAccountMock).toBeCalledWith({ name, email, password })
  })

  it('Should Exception when CreateAccount return a Exception', () => {
    const { sut, createAccountStub } = makeSut()
    jest.spyOn(createAccountStub, 'addAccount').mockImplementation(() => {
      throw Error()
    })
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'invalid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(500)
    expect(response).toEqual(serverError())
  })
})
