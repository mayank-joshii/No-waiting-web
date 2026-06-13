import { defineType, defineField } from 'sanity'

export const contactType = defineType({
  name: 'contact',
  title: 'Contact Message',
  type: 'document',
  fields: [
    defineField({
      name: 'first',
      title: 'First Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'last',
      title: 'Last Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      options: {
        list: [
          { title: 'General Inquiries', value: 'general' },
          { title: 'Partner Program', value: 'partner' },
          { title: 'Restaurant Onboarding', value: 'onboarding' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'restaurant',
      title: 'Restaurant Name',
      type: 'string'
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string'
    }),
    defineField({
      name: 'locations',
      title: 'Locations Count',
      type: 'string'
    }),
    defineField({
      name: 'message',
      title: 'Message Content',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'read',
      title: 'Mark as Read',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'createdAt',
      title: 'Received At',
      type: 'datetime',
      validation: Rule => Rule.required()
    })
  ],
  readOnly: true
})
