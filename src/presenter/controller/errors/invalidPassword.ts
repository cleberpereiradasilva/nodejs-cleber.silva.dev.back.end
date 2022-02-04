import { httpResponse } from '../protocols/httpResponse'

export const invalidPassword = (): httpResponse => ({
  statusCode: 400,
  body: new Error('Invalid Password')
})
