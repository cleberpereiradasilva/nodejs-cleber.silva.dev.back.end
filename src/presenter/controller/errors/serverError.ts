import { HttpResponse } from '../protocols'

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new Error('Internal Server Error')
})
