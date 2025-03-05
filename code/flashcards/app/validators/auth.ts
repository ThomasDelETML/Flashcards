import vine from '@vinejs/vine'

const loginUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3), // Vérifie que `username` n'est pas vide
    password: vine.string().trim().minLength(4), // Assure que `password` est bien pris en compte
  })
)

export { loginUserValidator }
