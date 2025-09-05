import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', function(table) {
    table.increments('id').primary();
    table.integer('category_id').unsigned().notNullable();
    table.foreign('category_id').references('id').inTable('categories');
    table.string('name').notNullable();
    table.text('description').nullable();
    table.decimal('price', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
}