import { SignupController } from './signup.controller'
import { Controller } from './protocols/controller'
import { badRequest } from './errors/badRequest'
import { invalidEmail } from './errors/invalidEmail'
import { invalidPassword } from './errors/invalidPassword'
import { PasswordValidator } from './protocols/passwordValidator'
import { EmailValidator } from './protocols/emailValidator'

describe('Signup Controller', () => {
  interface sutType {
    sut: Controller
    validatorForEmail: EmailValidator
    validatorForPassword: PasswordValidator
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

  const makeSut = (): sutType => {
    const validatorForEmail = new ValidatorForEmail()
    const validatorForPassword = new ValidatorForPassword()
    const sut = new SignupController(validatorForEmail, validatorForPassword)
    return {
      sut,
      validatorForEmail,
      validatorForPassword
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
    expect(response).toEqual(badRequest('name'))
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
    expect(response).toEqual(badRequest('email'))
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
    expect(response).toEqual(badRequest('password'))
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
    expect(response).toEqual(badRequest('confirmation'))
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
    expect(response).toEqual(badRequest('confirmation'))
  })

  it('Should correct email be called in EmailValidator', () => {
    const { sut, validatorForEmail } = makeSut()
    const isValidMock = jest.spyOn(validatorForEmail, 'isValid')
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
    const { sut, validatorForEmail } = makeSut()
    jest.spyOn(validatorForEmail, 'isValid').mockReturnValueOnce(false)
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'invalid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response).toEqual(invalidEmail())
  })

  it('Should correct password be called in PasswordValidator', () => {
    const { sut, validatorForPassword } = makeSut()
    const isValidMock = jest.spyOn(validatorForPassword, 'isValid')
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
    const { sut, validatorForPassword } = makeSut()
    jest.spyOn(validatorForPassword, 'isValid').mockReturnValueOnce(false)
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'invalid_email',
        password: 'invalid_password',
        confirmation: 'invalid_password'
      }
    })
    expect(response).toEqual(invalidPassword())
  })

  // check expetion
})
