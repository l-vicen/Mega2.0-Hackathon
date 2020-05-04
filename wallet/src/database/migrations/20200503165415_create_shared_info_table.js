
exports.up = (knex) => (
  knex.schema.createTable('shared_info', table => {
    table.string('id').primary()
    table.string('owner_id').notNullable()
    table.foreign('owner_id').references('id').inTable('users')
    
    table.string('allowed_user_id').notNullable()
    table.foreign('allowed_user_id').references('id').inTable('users')

    table.datetime('permission_date').notNullable()
    table.string('hash').notNullable()
  })
)

exports.down = (knex) => (
  knex.schema.dropTable('shared_info')
)
