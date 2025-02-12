import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class EnsureAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { auth, session, response } = ctx

    try {
      // Vérifie si l'utilisateur est connecté
      const isAuthenticated = await auth.check()
      if (!isAuthenticated || !auth.user?.isAdmin) {
        // Affiche un message d'erreur à l'utilisateur
        session.flash('error', 'Vous devez avoir les droits admin pour accéder à cette page')

        // Redirige l'utilisateur vers la page d'accueil
        return response.redirect().toRoute('home')
      }

      // Passe au middleware suivant ou à la logique de la route
      await next()
    } catch (error) {
      console.error('Erreur dans EnsureAdminMiddleware :', error)

      // Redirige vers la page d'accueil en cas d'erreur
      session.flash('error', 'Une erreur est survenue')
      return response.redirect().toRoute('home')
    }
  }
}
