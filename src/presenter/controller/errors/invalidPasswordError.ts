import { HttpResponse } from '../protocols'
import { InvalidPasswordError } from '../protocols/errors'

export const invalidPasswordError = (): HttpResponse => ({
  statusCode: 400,
  body: new InvalidPasswordError()
})
