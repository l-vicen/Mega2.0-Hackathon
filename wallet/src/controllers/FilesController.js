const connection = require('../database/connection')
const crypto = require('crypto')
const DateUtils = require('../libs/DateUtils')
const EXPIRATION_TIME = require('../constants').EXPIRATION_TIME
const Blockchain = require('../bc/Blockchain')
const stream = require('stream')

const USERS_TABLE = 'users'
const SHARED_TABLE = 'shared_info'

module.exports = {
  async share(request, response) {
    const { token, allowed_user_id, hash } = request.body

    const owner = await connection(USERS_TABLE).where('token', '=', token).select('*').first();

    if (!owner || DateUtils.isExpired(owner.token_request, 3600))
      return response.status(400).json({
        error: `User doesn't exist.`
      })

    const allowed = await connection(USERS_TABLE).where('id', '=', allowed_user_id).select('*').first();
    if (!allowed || !allowed.readonly)
      return response.status(400).json({
        error: `User doesn't exist.`
      })

    const id = crypto.randomBytes(4).toString('HEX');

    await connection(SHARED_TABLE).insert({
      id,
      owner_id: owner.id,
      allowed_user_id,
      hash,
      permission_date: Date.now()
    })

    return response.status(201).json({ id })
  },

  async get(request, response) {
    const { id, allowed_user_id } = request.body

    const info = await connection(SHARED_TABLE)
        .where('id', '=', id)
        .where('allowed_user_id', '=', allowed_user_id)
        .select('hash', 'permission_date')
        .first();

    if (!info || DateUtils.isExpired(info.permission_date, EXPIRATION_TIME))
      return response.status(401).json({
        error: 'Unauthorized.'
      })

    const file = Blockchain.get(info.hash);
    console.log(file.data.data)

    if (file){
      var fileContents = Buffer.from(file.data.data);
      var readStream = new stream.PassThrough();
      readStream.end(fileContents);

      response.set('Content-disposition', 'attachment; filename=' + file.name);
      response.set('Content-Type', 'application/pdf');

      readStream.pipe(response);
      return;
    }

    return response.status(400).json({
      error: `File doesn't exist.`
    })
  },
}