/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
        table.string('email').unique(); // Dodaj kolumnę email z ograniczeniem unikalności
    });
};

exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
        table.dropColumn('email'); // Usuń kolumnę email podczas wycofywania migracji
    });
};

