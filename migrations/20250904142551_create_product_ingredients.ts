import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('product_ingredients', function(table) {
    table.increments('id').primary();
    table.integer('product_id').unsigned().notNullable();
    table.foreign('product_id').references('id').inTable('products');
    table.integer('ingredient_id').unsigned().notNullable();
    table.foreign('ingredient_id').references('id').inTable('ingredients');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('product_ingredients');
}