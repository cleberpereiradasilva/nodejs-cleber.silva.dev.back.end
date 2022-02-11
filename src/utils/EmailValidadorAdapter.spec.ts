import { EmailValitorAdapter } from './EmailValidatorAdapter'
import EmailValidator from 'email-validator'
import { EmailValidator as EmailValidatorProtocol } from '../presenter/controller/protocols/emailValidator'
jest.mock('email-validator', () => ({
  validate (email: string): boolean { return true }
}))
interface makeSutType {
  emailValidatorAdapter: EmailValidatorProtocol
}

function makeSut (): makeSutType {
  return ({
    emailValidatorAdapter: new EmailValitorAdapter()
  })
}

describe('EmailValitorAdapter', () => {
  it('Expected false on a invalid e-mail', () => {
    jest.spyOn(EmailValidator, 'validate').mockReturnValueOnce(false)
    const { emailValidatorAdapter } = makeSut()
    const isValid = emailValidatorAdapter.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })

  it('Expected true on a valid e-mail', () => {
    const { emailValidatorAdapter } = makeSut()
    const isValid = emailValidatorAdapter.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })

  it('Expected isValid will be called with correct value', () => {
    const { emailValidatorAdapter } = makeSut()
    const validateMock = jest.spyOn(EmailValidator, 'validate')
    emailValidatorAdapter.isValid('valid_email@email.com')
    expect(validateMock).toBeCalledWith('valid_email@email.com')
  })
})
