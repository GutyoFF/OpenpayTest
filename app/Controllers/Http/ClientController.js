'use strict'
const { ioc } = require('@adonisjs/fold')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = ioc.use('App/Models/User')
const Env = ioc.use('Env')

const Openpay = require('openpay')
const Api = new Openpay(Env.getOrFail('OPENPAY_MERCHANT_ID'), Env.getOrFail('OPENPAY_PK'), false)

/**
* Resourceful controller for interacting with clients
*/
class ClientController {
  /**
  * Show a list of all clients.
  * GET clients
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async index ({ request, response, view }) {
    response.implicitEnd = false
    const paramsData = request.only(User.index)
    console.log(paramsData)
    if (paramsData.external_id == null) {
      paramsData.offset = paramsData.page * paramsData.limit
    }
    const searchParams = paramsData
    Api.customers.list(searchParams, function (error, list, opresponse) {
      const data = {}
      if (error == null) {
        data.clients = list
      } else {
        console.log(opresponse.body)
        data.message = opresponse.body.description
      }
      response.status(opresponse.statusCode).json(data)
    })
    response.end()
  }
  /**
  * Create/save a new client.
  * POST clients
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  */

  async store ({ request, response }) {
    response.implicitEnd = false
    const customerRequest = request.only(User.customerStore)
    const externalId = `${Env.getOrFail('EXTERNAL_ID')}_${Date.now()}`
    customerRequest.external_id = externalId
    await this.storeCustomer(customerRequest, async function (data, statusCode) {
      if (data.created) {
        const userData = request.only(User.store)
        userData.customer_id = data.customer.id
        userData.external_id = data.customer.external_id
        const user = await User.create(userData)
        data.user = user
      }
      response.status(statusCode).json(data)
    })
    response.end()
  }

  async storeCustomer (customerData, fn) {
    const data = {}
    Api.customers.create(customerData, function (error, customer, opresponse) {
      if (error == null) {
        data.created = true
        data.customer = customer
        data.message = 'Cliente registrado'
      } else {
        data.created = false
        data.message = opresponse.body.description
      }
      console.log(data)
      fn(data, opresponse.statusCode)
    })
  }

  /**
  * Display a single client.
  * GET clients/:id
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async show ({ params, request, response, view }) {
    response.implicitEnd = false
    Api.customers.get(params.id, function (error, customer, opresponse) {
      const data = {}
      if (error == null) {
        data.client = customer
      } else {
        data.message = opresponse.body.description
      }
      response.status(opresponse.statusCode).json(data)
    })
    response.end()
  }

  /**
  * Update client details.
  * PUT or PATCH clients/:id
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  */
  async update ({ params, request, response }) {
  }

  /**
  * Delete a client with id.
  * DELETE clients/:id
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  */
  async destroy ({ params, request, response }) {
    response.implicitEnd = false
    Api.customers.delete(params.id, function (error) {
      const data = {}
      if (error == null) {
        data.message = 'Cliente eliminado'
        data.statusCode = 200
      } else {
        data.message = error.description
        data.statusCode = error.http_code
      }
      response.status(data.statusCode).json(data)
    })
    response.end()
  }
}

module.exports = ClientController
