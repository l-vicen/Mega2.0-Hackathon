
exports.up = (knex) => (
  knex.schema.createTable('wallet', (table) => {
    table.string('id').primary()
    table.datetime('created_at').notNullable()
    table.string('hash').notNullable()
    
    table.string('user_id').notNullable()
    table.foreign('user_id').references('id').inTable('users')
  })
)

exports.down = (knex) => (
  knex.schema.dropTable('wallet')
);
