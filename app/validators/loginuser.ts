import vine from '@vinejs/vine'

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().exists({ table: 'users', column: 'email' }),
    password: vine.string(),
  })
)
