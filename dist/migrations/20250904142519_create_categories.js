export async function up(knex) {
    return knex.schema.createTable('categories', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
        table.timestamp('deleted_at').nullable();
    });
}
export async function down(knex) {
    return knex.schema.dropTable('categories');
}
//# sourceMappingURL=20250904142519_create_categories.js.map