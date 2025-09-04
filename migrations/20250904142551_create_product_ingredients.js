/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('product_ingredients', function(table) {
		table.increments('id').primary();
		table.integer('product_id').unsigned().notNullable();
		table.foreign('product_id').references('id').inTable('products');
		table.integer('ingredient_id').unsigned().notNullable();
		table.foreign('ingredient_id').references('id').inTable('ingredients');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('product_ingredients');
};
