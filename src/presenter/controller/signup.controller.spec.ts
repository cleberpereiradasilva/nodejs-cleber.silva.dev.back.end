import { SignupController } from './signup.controller'
import {
  Controller,
  PasswordValidator,
  EmailValidator,
  CreateAccount,
  PasswordEncrypt
} from './protocols'

import {
  AccountModel,
  CreateAccountModel
} from '../../domain/models'

import {
  invalidParamError,
  serverError,
  invalidEmailError,
  invalidPasswordError
} from './http-helpers'

describe('Signup Controller', () => {
  interface sutType {
    sut: Controller
    validatorForEmailStub: EmailValidator
    validatorForPasswordStub: PasswordValidator
    createAccountStub: CreateAccount
    encryptPasswordStub: PasswordEncrypt
  }

  class EncryptPassword implements PasswordEncrypt {
    encrypt (password: string): string {
      return 'hash_encrypted'
    }
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
    constructor (private readonly encryptPassword: EncryptPassword) {
      this.encryptPassword = encryptPassword
    }

    addAccount = async (createAccountModel: CreateAccountModel): Promise<AccountModel> => {
      const fackeAccount = {
        ...createAccountModel,
        id: 'valid_id',
        password: this.encryptPassword.encrypt(createAccountModel.password)
      }
      return await Promise.resolve(fackeAccount)
    }
  }

  const makeSut = (): sutType => {
    const validatorForEmailStub = new ValidatorForEmail()
    const validatorForPasswordStub = new ValidatorForPassword()
    const encryptPasswordStub = new EncryptPassword()
    const createAccountStub = new CreateAccountStub(encryptPasswordStub)

    const sut = new SignupController(validatorForEmailStub,
      validatorForPasswordStub,
      createAccountStub)
    return {
      sut,
      validatorForEmailStub,
      validatorForPasswordStub,
      createAccountStub,
      encryptPasswordStub
    }
  }
  it('Should return 400 when no provide name', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      body: {
        email: 'valid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('name'))
  })
  it('Should return 400 when no provide email', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      body: {
        name: 'valid_name',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('email'))
  })

  it('Should return 400 when no provide password', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('password'))
  })

  it('Should return 400 when no provide confirmation', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(400)
    expect(response).toEqual(invalidParamError('confirmation'))
  })

  it('Should return 400 when password is diferente of confirmation', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
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

  it('Should correct email be called in EmailValidator', async () => {
    const { sut, validatorForEmailStub } = makeSut()
    const isValidMock = jest.spyOn(validatorForEmailStub, 'isValid')
    await sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(isValidMock).toBeCalledWith('valid_email')
  })

  it('Should return 400 when email is not a valid email', async () => {
    const { sut, validatorForEmailStub } = makeSut()
    jest.spyOn(validatorForEmailStub, 'isValid').mockReturnValueOnce(false)
    const response = await sut.handle({
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

  it('Should correct password be called in PasswordValidator', async () => {
    const { sut, validatorForPasswordStub } = makeSut()
    const isValidMock = jest.spyOn(validatorForPasswordStub, 'isValid')
    await sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(isValidMock).toBeCalledWith('valid_password')
  })

  it('Should return 400 when password is not a valid password', async () => {
    const { sut, validatorForPasswordStub } = makeSut()
    jest.spyOn(validatorForPasswordStub, 'isValid').mockReturnValueOnce(false)
    const response = await sut.handle({
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

  it('Should Exception when ValidatorForEmail return a Exception', async () => {
    const { sut, validatorForPasswordStub } = makeSut()
    jest.spyOn(validatorForPasswordStub, 'isValid').mockImplementation(() => {
      throw Error()
    })
    const response = await sut.handle({
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

  it('Should call addAccount with correct data', async () => {
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
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(200)
    expect(response.body.id).not.toBeNull()
    const { name, email, password } = request.body
    expect(addAccountMock).toBeCalledWith({ name, email, password })
  })

  it('Should Exception when CreateAccount return a Exception', async () => {
    const { sut, createAccountStub } = makeSut()
    jest.spyOn(createAccountStub, 'addAccount').mockImplementation(async () => {
      throw Error()
    })
    const response = await sut.handle({
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

  it('Should Encrypt password', async () => {
    const { sut, encryptPasswordStub } = makeSut()
    const encryptMock = jest.spyOn(encryptPasswordStub, 'encrypt')
    const response = await sut.handle({
      body: {
        name: 'valid_name',
        email: 'invalid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(200)
    expect(response.body.password).toBe('hash_encrypted')
    expect(encryptMock).toBeCalledWith('valid_password')
  })
})
