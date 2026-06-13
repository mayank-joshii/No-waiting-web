import { defineType, defineField } from 'sanity'

export const waitlistType = defineType({
  name: 'waitlist',
  title: 'Waitlist Lead',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    }),
    defineField({
      name: 'createdAt',
      title: 'Joined At',
      type: 'datetime',
      validation: Rule => Rule.required()
    })
  ],
  readOnly: true
})
