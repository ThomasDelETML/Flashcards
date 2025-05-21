//import { dd } from '@adonisjs/core/services/dumper'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async login({ view }: HttpContext) {
    return view.render('pages/login')
  }

  public async register({ view }: HttpContext) {
    return view.render('pages/register')
  }

  public async redirectToLogin({ response }: HttpContext) {
    return response.redirect('/login')
  }

  //Gérer la déconnexion d'un utilisateur
  async handleLogout({ auth, response }: HttpContext) {
    // Utilise le Guard 'web' pour déconnecter l'utilisateur -> Voir le fichier config/auth.ts
    await auth.use('web').logout()

    return response.redirect().toRoute('accueil')
  }
}
