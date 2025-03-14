//import { dd } from '@adonisjs/core/services/dumper'
import type { HttpContextContract, HttpContext } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ view }: HttpContextContract) {
    return view.render('pages/login')
  }

  public async register({ view }: HttpContextContract) {
    return view.render('pages/register')
  }

  public async redirectToLogin({ response }: HttpContextContract) {
    return response.redirect('http://localhost:3333/login')
  }

  //Gérer la déconnexion d'un utilisateur
  async handleLogout({ auth, session, response }: HttpContext) {
    // Utilise le Guard 'web' pour déconnecter l'utilisateur -> Voir le fichier config/auth.ts
    await auth.use('web').logout()

    return response.redirect().toRoute('accueil')
  }
}
