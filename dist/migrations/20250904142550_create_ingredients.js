export async function up(knex) {
    return knex.schema.createTable('ingredients', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.boolean('is_allergen').notNullable().defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable();
        table.timestamp('deleted_at').nullable();
    });
}
export async function down(knex) {
    return knex.schema.dropTable('ingredients');
}
//# sourceMappingURL=20250904142550_create_ingredients.js.map