import { httpResponse } from '../helpers/httpResponse'
export interface Controller{
  handle: () => httpResponse
}
