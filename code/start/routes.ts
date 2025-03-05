/*
|--------------------------------------------------------------------------
| Le fichier des routes
|--------------------------------------------------------------------------
|
| Le fichier des routes a pour but de définir toutes les routes HTTP.
|
*/

import AuthController from '#controllers/auth_controller'
import TeachersController from '#controllers/teachers_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Route permettant d'accéder à la liste des enseignants (homepage)
router.get('/', [TeachersController, 'index']).as('home')

// Route permettant de voir les détails d'un enseignant
router
  .get('/teacher/:id/show', [TeachersController, 'show'])
  .as('teacher.show')
  .use(middleware.auth())

// Route permettant d'afficher le formulaire permettant l'ajout d'un enseignant
router
  .get('/teacher/add', [TeachersController, 'create'])
  .as('teacher.create')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())

// Route permettant l'ajout de l'enseignant
router
  .post('/teacher/add', [TeachersController, 'store'])
  .as('teacher.store')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())

// Route permettant d'afficher le formulaire permettant la mise à jour d'un enseignant
router
  .get('/teacher/:id/edit', [TeachersController, 'edit'])
  .as('teacher.edit')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())

// Route permettant la modification de l'enseignant
router
  .post('/teacher/:id/update', [TeachersController, 'update'])
  .as('teacher.update')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())

// Route permettant de supprimer un enseignant
router
  .get('/teacher/:id/destroy', [TeachersController, 'destroy'])
  .as('teacher.destroy')
  .use(middleware.auth())
  .use(middleware.ensureAdmin())

// Route permettant de se connecter
router
  .post('/login', [AuthController, 'handleLogin'])
  .as('auth.handleLogin')
  .use(middleware.guest())

// Route permettant de se déconnecter
router
  .post('/logout', [AuthController, 'handleLogout'])
  .as('auth.handleLogout')
  .use(middleware.auth())
