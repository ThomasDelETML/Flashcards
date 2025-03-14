import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { deckValidator } from '#validators/deck'
import Deck from '#models/deck'

export default class CartesController {
  /**
   * Affiche la page de création d'un deck
   */
  public async create({ view, params }: HttpContextContract) {
    const deckId = params.id
    return view.render('pages/cartes/create', {
      title: "Ajout d'une nouvelle carte",
      deckId: deckId,
    })
  }

  /**
   * Enregistre un nouveau deck dans la base de données
   */
  public async store({ request, session, response, auth }: HttpContextContract) {
    try {
      // Valider les données envoyées
      const { name, description } = await request.validateUsing(deckValidator)

      // Vérifier si l'utilisateur est bien authentifié
      if (!auth.user) {
        session.flash({ error: 'Vous devez être connecté pour créer un deck.' })
        return response.redirect().toRoute('getlogin')
      }

      // Sauvegarder le deck dans la base de données
      const user_id = auth.user.id
      const deck = await Deck.create({
        name,
        description,
        user_id, // Associe le deck à l'utilisateur
      })

      console.log('Deck créé avec succès:', deck)

      // Ajouter un message de succès en session
      session.flash('success', 'Le nouveau deck a été ajouté avec succès !')
      return response.redirect().toRoute('accueil')
    } catch (error) {
      console.error('Erreur lors de la création du deck:', error)

      // Afficher les erreurs de validation
      session.flash({ error: error.messages ?? 'Une erreur est survenue.' })
      return response.redirect().toRoute('cartes.create')
    }
  }
}
