import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cartes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('question', 255).nullable() // Crée la colonne 'name'
      table.string('responce').nullable() // Crée la colonne 'description'
      table.integer('deck_id').unsigned().references('id').inTable('decks').onDelete('CASCADE') // Clé étrangère vers la table 'users'
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}