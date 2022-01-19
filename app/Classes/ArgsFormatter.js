'use strict'
class ArgsFormatter {
  constructor () {
    this.errors = []
  }

  addError (error, field, validation, args) {
    let message = args.length ? `field (${field}) must be (${validation}) [${args}]`
      : `field (${field}) must be (${validation})`

    if (error instanceof Error) {
      validation = 'ENGINE_EXCEPTION'
      message = error.message
    }
    this.errors.push({ field, message, validation, args })
  }

  // return null if no errors are present,
  // otherwise validate will be rejected with an empty
  // error
  toJSON () {
    const eJSON = JSON.parse(JSON.stringify({
      errors: this.errors.map((e) => {
        return {
          title: e.validation,
          detail: e.message,
          source: {
            pointer: e.field
          },
          args: e.args.length ? e.args : ''
        }
      })
    }))
    return this.errors.length ? eJSON : null
  }
}

module.exports = ArgsFormatter
