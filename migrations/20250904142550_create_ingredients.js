/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('ingredients', function(table) {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.boolean('is_allergen').notNullable().defaultTo(false);
		table.timestamp('created_at').defaultTo(knex.fn.now());
		table.timestamp('updated_at').nullable();
		table.timestamp('deleted_at').nullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('ingredients');
};
