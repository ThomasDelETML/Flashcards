import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'decks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Crée la colonne 'id'
      table.string('name', 255).notNullable() // Crée la colonne 'name'
      table.text('description').nullable() // Crée la colonne 'description'
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Clé étrangère vers la table 'users'
      table.timestamps() // Crée les colonnes 'created_at' et 'updated_at'
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
