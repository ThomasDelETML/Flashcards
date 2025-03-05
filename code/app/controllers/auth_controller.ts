import type { HttpContext } from '@adonisjs/core/http'
import { loginUserValidator } from '#validators/auth'
import User from '#models/user'

/**
 * Controller pour l'authentification
 */
export default class AuthController {
  /**
   * Gérer la connexion d'un utilisateur
   */
  async handleLogin({ request, auth, session, response }: HttpContext) {
    // Récupère les données validées
    const { username, password } = await request.validateUsing(loginUserValidator)

    // Récupère l'utilisateur correspondant aux données saisies par l'utilisateur
    const user = await User.verifyCredentials(username, password)

    // Utilise le guard 'web' pour connecter l'utilisateur -> Voir le fichier config/auth.ts
    await auth.use('web').login(user)

    // Affiche un msg à l'utilsateur
    session.flash('success', "L'utilisateur s'est connecté avec succès")

    // Redirige vers la route ayant pour nom 'home'
    return response.redirect().toRoute('home')
  }

  /**
   * Gérer la déconnexion d'un utilisateur
   */
  async handleLogout({ auth, session, response }: HttpContext) {
    // Utilise le Guard 'web' pour déconnecter l'utilisateur -> Voir le fichier config/auth.ts
    await auth.use('web').logout()

    // Affiche un message à l'utilisateur
    session.flash('success', "L'utilisateur s'est déconnecté avec succès")

    // Redirige la réponse sur la route 'home'
    return response.redirect().toRoute('home')
  }
}
