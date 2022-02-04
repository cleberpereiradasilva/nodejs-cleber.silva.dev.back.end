export class InvalidEmailError extends Error {
  constructor (field: string) {
    super(`Invalid email ${field}`)
    this.name = 'InvalidEmailError'
  }
}
