import * as EmailValidatorImp from 'email-validator'
import { EmailValidator } from '../presenter/controller/protocols/emailValidator'
export class EmailValitorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return EmailValidatorImp.validate(email)
  }
}
