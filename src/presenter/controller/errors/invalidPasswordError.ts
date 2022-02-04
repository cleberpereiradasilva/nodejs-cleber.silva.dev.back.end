import { httpResponse } from '../protocols/httpResponse'
import { InvalidPasswordError } from '../protocols/errors/InvalidPasswordError'

export const invalidPasswordError = (): httpResponse => ({
  statusCode: 400,
  body: new InvalidPasswordError()
})
