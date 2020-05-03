const connection = require('../database/connection')
const DateUtils = require('../libs/DateUtils')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const EXPIRATION_TIME = require('../constants').EXPIRATION_TIME

const USERS_TABLE = 'users'

module.exports = {
  async create(request, response) {
    const id = crypto.randomBytes(4).toString('HEX')
    let { password } = request.body;
    password = bcrypt.hashSync(password, 10)

    await connection(USERS_TABLE).insert({ id, password })

    return response.json({ id })
  },

  async getToken(request, response) {
    const { id, password } = request.body

    const user = await connection(USERS_TABLE).where('id', '=', id).select('password', 'token', 'token_request').first();

    if (!user || !bcrypt.compareSync(password + "", user.password)) {
      return response.status(401).json({
        error: `User doesn't exist.`
      })
    }

    if (user.token && !DateUtils.isExpired(user.token_request, EXPIRATION_TIME)) {
      return response.json({ token: user.token })
    }

    const token = crypto.randomBytes(16).toString('HEX')
    const token_request = Date.now()

    await connection(USERS_TABLE)
        .where('id', '=', id)
        .update({ token, token_request })

    return response.json({ token })
  }
}
