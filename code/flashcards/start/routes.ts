/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import { middleware } from './kernel.js'

router.on('/').render('pages/home').as('home').use(middleware.auth())

router.on('/login').render('pages/login').as('login')

router.on('/register').render('pages/register').as('register')

router.post('/register', [AuthController, 'create']).as('user.create')

// Route permettant de se connecter
router
  .post('/login', [AuthController, 'handleLogin'])
  .as('auth.handleLogin')
  .use(middleware.guest())

// Route permettant de se déconnecter
router.post('/logout', [AuthController, 'handleLogout']).as('auth.handleLogout')
