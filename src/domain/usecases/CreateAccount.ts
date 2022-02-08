import { AccountModel, CreateAccountModel } from '../model'

export interface CreateAccount{
  addAccount: (createAccountModel: CreateAccountModel) => AccountModel
}
