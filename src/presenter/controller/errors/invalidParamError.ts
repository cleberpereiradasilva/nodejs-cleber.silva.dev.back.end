import { httpResponse } from '../protocols/httpResponse'
import { InvalidParamError } from '../protocols/errors/InvalidParamError'

export const invalidParamError = (field: string): httpResponse => ({
  statusCode: 400,
  body: new InvalidParamError(`Invalid param '${field}'`)
})
