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
  // test if handle exist

  // check if receive corect params

  // check email, name, password, confirm password

  // check expetion
})
