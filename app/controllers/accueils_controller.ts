import type { HttpContext } from '@adonisjs/core/http'
import { deckValidator } from '#validators/deck'
import Deck from '#models/deck'
import Carte from '#models/carte'
export default class AccueilsController {
  /**
   * Display a list of resource
   */

  public async accueil({ view, auth }: HttpContext) {
    const userId = auth.user.id
    const decks = await Deck.query().where('user_id', userId).orderBy('name', 'asc')

    return view.render('pages/home', { decks })
  }
  /**
   * Display form to create a new record
   */
  public async create({ view }: HttpContext) {
    // Passe deckId (ou même le deck complet) à la vue
    return view.render('pages/decks/create', {
      title: "Ajout d'une nouvelle carte",
    })
  }

  /**
   * Handle form submission for the create action
   */
  public async store({ request, session, response, auth }: HttpContext) {
    try {
      const { name, description } = await request.validateUsing(deckValidator)

      const user_id = auth.user.id

      await Deck.create({ name, description, user_id })
      session.flash('success', 'Le nouveau deck a été ajouté avec succès !')
      return response.redirect().toRoute('accueil')
    } catch (err) {
      session.flash({
        error:
          "il faut que le nom du deck n'existe pas deja et que la description fasse 10 caractères !",
      })
      return response.redirect().toRoute('accueil')
    }
  }

  public async deck({ params, session, view, response }: HttpContext) {
    const deckId = params.id
    if (isNaN(Number(deckId))) {
      session.flash({ errors: [{ message: 'ID du deck invalide' }] })
      return response.redirect().toRoute('accueil')
    }

    const deck = await Deck.findBy('id', deckId)
    if (!deck) {
      session.flash({ errors: [{ message: 'deck inexistant' }] })
      return response.notFound({ message: 'deck non trouvé' })
    }
    const cards = await Carte.query().orderBy('id', 'asc').where('deck_id', deck.id)
    return view.render('pages/decks/showDeck', {
      title: `voici le deck ${deck.name}`,
      deck: deck,
      cards,
    })
  }

  public async delete({ params, session, response }: HttpContext) {
    const deckId = params.id
    if (isNaN(Number(deckId))) {
      session.flash({ errors: [{ message: 'ID du deck invalide' }] })
      return response.redirect().toRoute('accueil')
    }

    const deck = await Deck.findOrFail(deckId)
    await deck.delete()

    session.flash('success', 'le deck a bien été supprimé !')
    return response.redirect().toRoute('accueil')
  }

  public async edit({ params, view }: HttpContext) {
    const deck = await Deck.findOrFail(params.id)

    return view.render('pages/decks/edit.edge', {
      title: 'modifier un deck',
      deck,
    })
  }

  public async update({ params, request, session, response }: HttpContext) {
    const { name, description } = await request.validateUsing(deckValidator)
    const deck = await Deck.findOrFail(params.id)
    if (deck) {
      await deck.merge({ name, description }).save()
    }
    session.flash('success', 'le deck a été mis a jour !')
    return response.redirect().toRoute('accueil')
  }
  /**
   * Handle form submission for the edit action
   */

  /**
   * Delete record
   */
}
