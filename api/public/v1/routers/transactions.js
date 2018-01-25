const controller = require('../controllers/transactions')
const schema = require('../schemas/transactions')

module.exports = (registrar) => {
  registrar.get('transactions', controller.index, {schema: schema.getTransactions})
  registrar.get('transactions/get', controller.show, {schema: schema.getTransaction})

  registrar.get('transactions/unconfirmed', controller.unconfirmed)
  registrar.get('transactions/unconfirmed/get', controller.showUnconfirmed)
}
