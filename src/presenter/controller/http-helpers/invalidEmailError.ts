import { HttpResponse } from '../protocols'
import { InvalidEmailError } from '../protocols/errors'

export const invalidEmailError = (): HttpResponse => ({
  statusCode: 400,
  body: new InvalidEmailError('Invalid email')
})
