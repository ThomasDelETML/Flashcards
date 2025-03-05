import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Création de users
    await User.createMany([
      { username: 'Albert', password: 'user', isAdmin: false },
      { username: 'Edouard', password: 'admin', isAdmin: true },
    ])
  }
}
