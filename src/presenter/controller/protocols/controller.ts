import { httpResponse } from './httpResponse'
export interface Controller{
  handle: (httpRequest: any) => httpResponse
}
