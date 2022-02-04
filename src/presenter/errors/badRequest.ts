import { httpResponse } from '../helpers/httpResponse'

export const badRequest = (field: string): httpResponse => ({
  statusCode: 400,
  body: new Error(`Invalid param '${field}'`)
})
