import vine from '@vinejs/vine'

export const UserValidator = vine.compile(
  vine.object({
    full_name: vine
      .string()
      .minLength(3)
      .maxLength(50)
      .unique({ table: 'users', column: 'full_name' }),
    email: vine.string().email().unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(6),
  })
)
