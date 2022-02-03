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
  it('Check if handle method exist', () => {
    const { sut } = makeSut()
    const response = sut.handle()
    expect(response.statusCode).toBe(200)
  })
  // test if handle exist

  // check if receive corect params

  // check email, name, password, confirm password

  // check expetion
})
