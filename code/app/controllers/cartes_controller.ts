import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Deck from '#models/deck'
import Carte from '#models/carte'

export default class CartesController {
  /**
   * Affiche la page de création d'une carte pour un deck donné
   */
  public async create({ view, params, session, response }: HttpContextContract) {
    const deckId = Number(params.id)

    if (isNaN(deckId)) {
      session.flash({ error: 'ID du deck invalide.' })
      return response.redirect().toRoute('accueil')
    }

    const deck = await Deck.find(deckId)
    if (!deck) {
      session.flash({ error: 'Deck introuvable.' })
      return response.redirect().toRoute('accueil')
    }

    return view.render('pages/cartes/createCard', {
      title: "Ajout d'une nouvelle carte",
      deck,
    })
  }

  /**
   * Enregistre une nouvelle carte dans un deck existant
   */
  public async store({ request, session, response, params }: HttpContextContract) {
    try {
      const { question, response: cardResponse } = request.only(['question', 'response'])
      const deckId = Number(params.id)

      if (isNaN(deckId)) {
        session.flash({ error: 'ID du deck invalide.' })
        return response.redirect().toRoute('accueil')
      }

      const deck = await Deck.find(deckId)
      if (!deck) {
        session.flash({ error: 'Deck introuvable.' })
        return response.redirect().toRoute('accueil')
      }

      // Validation
      if (!question || question.trim().length < 10 || !cardResponse || cardResponse.trim() === '') {
        session.flash({
          error:
            'La question doit contenir au moins 10 caractères et la réponse ne peut pas être vide.',
          question,
          response: cardResponse,
        })
        return response.redirect().back()
      }

      // Vérification de duplication
      const existingCard = await Carte.query()
        .where('deck_id', deckId)
        .andWhere('question', question.trim())
        .first()

      if (existingCard) {
        session.flash({ info: 'Une carte avec cette question existe déjà dans ce deck.' })
        return response.redirect().toRoute('deck.cards', { id: deckId })
      }

      await Carte.create({
        question: question.trim(),
        response: cardResponse.trim(),
        deck_id: deckId,
      })

      session.flash('success', 'La nouvelle carte a été ajoutée avec succès !')
      return response.redirect().toRoute('deck.cards', { id: deckId })
    } catch (err) {
      console.error(err)
      session.flash({
        error:
          'Erreur lors de la création de la carte. Assurez-vous que tous les champs sont valides.',
      })
      return response.redirect().back()
    }
  }

  /**
   * Affiche toutes les cartes (pour admin ou debug par exemple)
   */
  public async index({ view }: HttpContextContract) {
    const cards = await Carte.all()
    return view.render('pages/cartes/index', { cards })
  }

  /**
   * Affiche toutes les cartes d’un deck spécifique
   */
  public async showDeckCards({ params, view, session, response }: HttpContextContract) {
    const deckId = Number(params.id)

    if (isNaN(deckId)) {
      session.flash({ error: 'ID du deck invalide.' })
      return response.redirect().toRoute('accueil')
    }

    const deck = await Deck.find(deckId)
    if (!deck) {
      session.flash({ error: 'Deck introuvable.' })
      return response.redirect().toRoute('accueil')
    }

    const cards = await Carte.query().where('deck_id', deckId)

    return view.render('pages/cartes/showDeckCards', {
      title: `Cartes du deck ${deck.name}`,
      deck,
      cards,
    })
  }

  /**
   * Affiche une carte spécifique
   */
  public async show({ params, view, session, response }: HttpContextContract) {
    const cardId = Number(params.card_id) // Use card_id from the route

    if (isNaN(cardId)) {
      session.flash({ error: 'ID de la carte invalide.' })
      return response.redirect().back()
    }

    const card = await Carte.find(cardId)
    if (!card) {
      session.flash({ error: 'Carte introuvable.' })
      return response.redirect().back()
    }

    return view.render('pages/cartes/showCard', { card })
  }

  /**
   * Supprime une carte
   */
  public async delete({ params, session, response }: HttpContextContract) {
    const cardId = Number(params.id)

    if (isNaN(cardId)) {
      session.flash({ error: 'ID de la carte invalide.' })
      return response.redirect().back()
    }

    const card = await Carte.find(cardId)
    if (!card) {
      session.flash({ error: 'Carte introuvable.' })
      return response.redirect().back()
    }

    try {
      await card.delete()
      session.flash({ success: 'La carte a été supprimée avec succès.' })
    } catch (err) {
      console.error(err)
      session.flash({ error: 'Erreur lors de la suppression de la carte.' })
    }

    return response.redirect().back()
  }

  /**
   * Affiche le formulaire d’édition d’une carte
   */
  public async edit({ params, view, session, response }: HttpContextContract) {
    const cardId = Number(params.id)

    if (isNaN(cardId)) {
      session.flash({ error: 'ID de la carte invalide.' })
      return response.redirect().toRoute('accueil')
    }

    const card = await Carte.find(cardId)
    if (!card) {
      session.flash({ error: 'Carte introuvable.' })
      return response.redirect().toRoute('accueil')
    }

    return view.render('pages/cartes/editCard', {
      title: 'Modifier la carte',
      card,
    })
  }

  /**
   * Met à jour une carte existante
   */
  public async update({ params, request, session, response }: HttpContextContract) {
    const cardId = Number(params.id)

    if (isNaN(cardId)) {
      session.flash({ error: 'ID de la carte invalide.' })
      return response.redirect().toRoute('accueil')
    }

    const card = await Carte.find(cardId)
    if (!card) {
      session.flash({ error: 'Carte introuvable.' })
      return response.redirect().toRoute('accueil')
    }

    try {
      const { question, response: cardResponse } = request.only(['question', 'response'])

      card.question = question
      card.response = cardResponse
      await card.save()

      session.flash({ success: 'Carte mise à jour avec succès.' })
      return response.redirect().toRoute('deck.cards', { id: card.deck_id })
    } catch (err) {
      console.error(err)
      session.flash({ error: 'Erreur lors de la mise à jour de la carte.' })
      return response.redirect().back()
    }
  }
}
