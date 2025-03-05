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
    console.log('🔍 Données reçues :', request.all()) // Vérifie les données brutes

    try {
      // Récupère les données validées
      const { username, password } = await request.validateUsing(loginUserValidator)
      console.log('✅ Données validées :', { username, password })

      // Si password est undefined -> erreur
      if (!password) {
        session.flash('error', 'Le mot de passe est requis')
        return response.redirect().back()
      }

      // Vérification des identifiants
      const user = await User.verifyCredentials(username, password)

      // Connexion
      await auth.use('web').login(user)
      session.flash('success', "L'utilisateur s'est connecté avec succès")
      return response.redirect().toRoute('home')
    } catch (error) {
      console.error('❌ Erreur :', error)
      session.flash('error', 'Identifiants invalides ou erreur serveur.')
      return response.redirect().back()
    }
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
