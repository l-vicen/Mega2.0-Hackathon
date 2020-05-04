
exports.up = (knex) => (
  knex.schema.createTable('users', (table) => {
    table.string('id').primary()
    table.datetime('token_request')
    table.string('token')
    table.string('password').notNullable()
    table.boolean('readonly').default(false)
  })
)

exports.down = (knex) => (
  knex.schema.dropTable('users')
)
