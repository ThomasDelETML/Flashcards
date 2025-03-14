/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '../app/controllers/auth_controllers.js'
import UsersController from '#controllers/users_controller'
import AccueilsController from '#controllers/accueils_controller'
import { middleware } from './kernel.js'
import CartesController from '../app/controllers/cartes_controller.js'

router.get('/accueil', [AccueilsController, 'accueil']).as('accueil').use(middleware.auth())

router.get('/createDeck', [AccueilsController, 'create']).as('showcreateDeck')

router.get('/', [AuthController, 'redirectToLogin'])

router.get('/login', [AuthController, 'login']).as('getlogin')

router.post('/login', [UsersController, 'login']).as('postlogin')

router.get('/register', [AuthController, 'register']).as('showregister')

router.post('/register', [UsersController, 'register']).as('postregister')

router.get('/users', [UsersController, 'getUsers']).use(middleware.auth())

router
  .post('/accueil/store', [AccueilsController, 'store'])
  .as('accueil.store')
  .use(middleware.auth())

router.get('/deck/:id', [AccueilsController, 'deck']).use(middleware.auth())

router
  .get('/deck/:id/createCarte', [CartesController, 'create'])
  .use(middleware.auth())
  .as('deck.createCarte')

router.post('/deck/:id/store', [CartesController, 'store']).use(middleware.auth()).as('deck.store')
router
  .get('/deck/:id/delete', [AccueilsController, 'delete'])
  .use(middleware.auth())
  .as('deck.delete')

router.get('/deck/:id/edit', [AccueilsController, 'edit']).as('deck.edit')
router.post('/deck/:id/update', [AccueilsController, 'update']).as('deck.update')

router.get('/cartes/create', [CartesController, 'create']).as('cartes.create')

router.post('/logout', [AuthController, 'handleLogout']).as('auth.handleLogout')
