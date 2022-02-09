import { HttpResponse } from '../protocols'
import { InvalidParamError } from '../protocols/errors'

export const invalidParamError = (field: string): HttpResponse => ({
  statusCode: 400,
  body: new InvalidParamError(`Invalid param '${field}'`)
})
