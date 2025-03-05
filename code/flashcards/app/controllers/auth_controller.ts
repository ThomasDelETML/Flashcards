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
    console.log('🔍 Données reçues :', request.all()) // Vérifie ce qui arrive

    try {
      // ✅ Vérification des données avec VineJS
      const payload = await request.validateUsing(loginUserValidator)
      console.log('✅ Données validées :', payload)

      // Vérifie que `password` est bien récupéré après validation
      if (!payload.password) {
        session.flash('error', 'Le mot de passe est manquant après validation.')
        return response.redirect().back()
      }

      // Vérifie l'utilisateur avec AdonisJS
      const user = await User.verifyCredentials(payload.username, payload.password)

      // Connexion
      await auth.use('web').login(user)
      session.flash('success', 'Connexion réussie !')
      return response.redirect().toRoute('home')
    } catch (error) {
      console.error("❌ Erreur de validation ou d'authentification :", error)

      session.flash('error', 'Identifiants invalides ou erreur de validation.')
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
