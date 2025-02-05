/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// router.on('/').render('pages/home')

router
  .get('/', async ({ view }) => {
    return view.render('pages/home')
  })
  .as('home')

router
  .get('/flashcards', async ({ view }) => {
    return view.render('pages/flashcards')
  })
  .as('flashcards')

router
  .get('/login', async ({ view }) => {
    return view.render('pages/login')
  })
  .as('login')
