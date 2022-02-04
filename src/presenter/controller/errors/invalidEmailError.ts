import { httpResponse } from '../protocols/httpResponse'
import { InvalidEmailError } from '../protocols/errors/InvalidEmailError'

export const invalidEmailError = (): httpResponse => ({
  statusCode: 400,
  body: new InvalidEmailError('Invalid email')
})
