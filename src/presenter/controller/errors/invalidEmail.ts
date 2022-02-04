import { httpResponse } from '../protocols/httpResponse'

export const invalidEmail = (): httpResponse => ({
  statusCode: 400,
  body: new Error('Invalid email')
})
