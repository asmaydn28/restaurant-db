export async function up(knex) {
    return knex.schema.createTable('product_ingredients', function (table) {
        table.increments('id').primary();
        table.integer('product_id').unsigned().notNullable();
        table.foreign('product_id').references('id').inTable('products');
        table.integer('ingredient_id').unsigned().notNullable();
        table.foreign('ingredient_id').references('id').inTable('ingredients');
    });
}
export async function down(knex) {
    return knex.schema.dropTable('product_ingredients');
}
//# sourceMappingURL=20250904142551_create_product_ingredients.js.map