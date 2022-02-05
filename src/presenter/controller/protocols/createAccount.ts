import { HttpRequest, HttpResponse } from './'
export interface CreateAccount{
  addAccount: (httpRequest: HttpRequest) => HttpResponse
}
