import { AccountModel, CreateAccountModel } from '../models'
export interface CreateAccount{
  addAccount: (createAccountModel: CreateAccountModel) => Promise<AccountModel>
}
