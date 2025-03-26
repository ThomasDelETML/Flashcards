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
  public async store({ request, session, response, auth }: HttpContextContract) {
    try {
      const { name, description } = await request.validateUsing(deckValidator)

      const user_id = auth.user.id

      await Deck.create({ name, description, user_id })
      session.flash('success', 'La nouvelle carte a été ajouté avec succès !')
      return response.redirect().toRoute('accueil')
    } catch (err) {
      session.flash({
        error:
          "il faut que le nom de la carte n'existe pas deja et que la description fasse 10 caractères !",
      })
      return response.redirect().toRoute('accueil')
    }
  }
  public async index({ view }: HttpContextContract) {
    const cards = await Card.all()
    return view.render('pages/cartes/index', { cards })
  }
}
