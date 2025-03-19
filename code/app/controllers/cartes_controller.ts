import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { deckValidator } from '#validators/deck'
import Deck from '#models/deck'
import Carte from '#models/carte' // Ajoutez le modèle de carte si vous avez une table pour les cartes

export default class CartesController {
  /**
   * Affiche la page de création d'une carte
   */
  public async create({ view, params }: HttpContextContract) {
    const deckId = params.id

    if (!deckId) {
      return view.render('errors/not-found', { message: 'Deck introuvable.' })
    }

    return view.render('pages/cartes/create', {
      title: "Ajout d'une nouvelle carte",
      deckId,
    })
  }

  /**
   * Enregistre une nouvelle carte dans un deck existant
   */
  public async store({ request, params, session, response, auth }: HttpContextContract) {
    try {
      // Récupérer l'ID du deck depuis l'URL ou le formulaire
      const deckId = params.id || request.input('deck_id')

      if (!deckId) {
        session.flash({ error: 'Aucun deck spécifié.' })
        return response.redirect().back()
      }

      // Valider les données envoyées
      const { question, response: answer } = request.only(['question', 'response'])

      if (!question || !answer) {
        session.flash({ error: 'Tous les champs doivent être remplis.' })
        return response.redirect().back()
      }

      // Vérifier si le deck existe
      const deck = await Deck.find(deckId)

      if (!deck) {
        session.flash({ error: 'Le deck spécifié est introuvable.' })
        return response.redirect().back()
      }

      // Vérifier si l'utilisateur est bien authentifié
      if (!auth.user) {
        session.flash({ error: 'Vous devez être connecté pour ajouter une carte.' })
        return response.redirect().toRoute('getlogin')
      }

      // Créer la carte associée au deck
      await deck.related('cartes').create({
        question,
        response: answer,
      })

      console.log(`Carte ajoutée avec succès au deck ${deckId}`)

      // Ajouter un message de succès en session
      session.flash('success', 'La carte a été ajoutée avec succès !')
      return response.redirect().toRoute('accueil')
    } catch (error) {
      console.error('Erreur lors de la création de la carte:', error)

      // Afficher les erreurs de validation
      session.flash({ error: error.messages ?? 'Une erreur est survenue.' })
      return response.redirect().back()
    }
  }
}
