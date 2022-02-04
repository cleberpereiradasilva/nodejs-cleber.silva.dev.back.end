import { httpResponse } from '../helpers/httpResponse'
export interface Controller{
  handle: (httpRequest: any) => httpResponse
}
