'use strict'
const { ioc } = require('@adonisjs/fold')
const ArgsFormatter = ioc.use('App/Classes/ArgsFormatter')

class IndexClient {
  get formatter () {
    return ArgsFormatter
  }

  get validateAll () {
    return true
  }

  get rules () {
    return {
      external_id: 'string|exists:users,external_id',
      page: 'required_without_all:external_id|integer|above:0',
      limit: 'required_without_all:external_id|integer|above:1',
      creation: 'required_without_all:external_id|date',
      'creation[gte]': 'required_without_all:external_id|date',
      'creation[lte]': 'required_without_all:external_id|date'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.badRequest(errorMessages)
  }
}

module.exports = IndexClient
