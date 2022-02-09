import { HttpResponse } from '../protocols'

export const success = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})
