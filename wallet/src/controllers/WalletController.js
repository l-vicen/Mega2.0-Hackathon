const connection = require('../database/connection')
const DateUtils = require('../libs/DateUtils')
const crypto = require('crypto')
const EXPIRATION_TIME = require('../constants').EXPIRATION_TIME
const Blockchain = require('../bc/Blockchain')

const USERS_TABLE = 'users'
const WALLET_TABLE = 'wallet'

module.exports = {
  async hashes(request, response) {
    const { token } = request.body

    const user = await connection(USERS_TABLE).where('token', '=', token).select('id', 'token', 'token_request').first();
    
    if (!user || DateUtils.isExpired(user.token_request, EXPIRATION_TIME))
      return response.status(401).json({ error: 'Unauthorized.' });

    const hashes = await connection(WALLET_TABLE).where('user_id', '=', user.id).select('hash');

    return response.status(200).json({ hashes })
  },

  async create(request, response) {
    const { name, token } = request.body
    const { file } = request.files

    const user = await connection(USERS_TABLE).where('token', '=', token).select('id', 'token', 'token_request').first();
    
    if (!user || DateUtils.isExpired(user.token_request, EXPIRATION_TIME))
      return response.status(401).json({ error: 'Unauthorized.' });

    const hash = Blockchain.addBlock({ name, data: file.data })

    await connection(WALLET_TABLE).insert({
      id: crypto.randomBytes(4).toString('HEX'),
      created_at: Date.now(),
      user_id: user.id,
      hash
    })

    return response.status(201).json({ success: true })
  }
}