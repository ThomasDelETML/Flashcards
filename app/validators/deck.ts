import vine from '@vinejs/vine'

export const deckValidator = vine.compile(
  vine.object({
    name: vine.string().unique({ table: 'decks', column: 'name' }),
    description: vine.string().minLength(10),
  })
)
