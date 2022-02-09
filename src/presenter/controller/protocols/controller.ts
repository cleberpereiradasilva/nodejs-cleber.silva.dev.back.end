import { HttpResponse } from './httpResponse'
export interface Controller{
  handle: (httpRequest: any) => Promise<HttpResponse>
}
