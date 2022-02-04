import { httpResponse } from '../protocols/httpResponse'

export const serverError = (): httpResponse => ({
  statusCode: 500,
  body: new Error('Internal Server Error')
})
