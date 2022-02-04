import { SignupController } from './signup.controller'
import { Controller } from './protocols/controller'
describe('Signup Controller', () => {
  interface sutType {
    sut: Controller
  }

  const makeSut = (): sutType => {
    const sut = new SignupController()
    return {
      sut
    }
  }
  it('Should return 200 when provide all correct data', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    })
    expect(response.statusCode).toBe(200)
  })
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
  })

  it('Should return 400 when passwor is diferente of confirmation', () => {
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
  })

  // check if receive corect params

  // check email, name, password, confirm password

  // check expetion
})
