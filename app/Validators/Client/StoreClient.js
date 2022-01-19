'use strict'
const { ioc } = require('@adonisjs/fold')
const ArgsFormatter = ioc.use('App/Classes/ArgsFormatter')

class StoreClient {
  get formatter () {
    return ArgsFormatter
  }

  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required|string|max:100',
      last_name: 'required|string|max:100',
      email: 'required|email|max:100|unique:users,email',
      requires_account: 'required|boolean',
      phone_number: 'required|string|max:15',
      'address.line1': 'required_if:address|string',
      'address.line2': 'string',
      'address.line3': 'string',
      'address.postal_code': 'required_if:address|string',
      'address.state': 'required_if:address|string',
      'address.city': 'required_if:address|string',
      'address.country_code': 'required_if:address|string|max:2'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.badRequest(errorMessages)
  }
}

module.exports = StoreClient
