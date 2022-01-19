'use strict'
const { ioc } = require('@adonisjs/fold')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = ioc.use('Model')

class User extends Model {
  static boot () {
    super.boot()
  }

  static get index () {
    return [
      'limit',
      'page',
      'external_id',
      'creation',
      'creation[gte]',
      'creation[lte]'
    ]
  }

  static get store () {
    return [
      'name',
      'last_name',
      'email',
      'customer_id',
      'external_id'
    ]
  }

  static get customerStore () {
    return [
      'name',
      'last_name',
      'email',
      'requires_account',
      'phone_number',
      'address'
    ]
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  orders () {
    return this.hasMany('App/Models/Order')
  }
}

module.exports = User
