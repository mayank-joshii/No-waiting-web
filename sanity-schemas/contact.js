export default {
  name: 'contact',
  title: 'Contact Message',
  type: 'document',
  fields: [
    {
      name: 'first',
      title: 'First Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'last',
      title: 'Last Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
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
    },
    {
      name: 'restaurant',
      title: 'Restaurant Name',
      type: 'string'
    },
    {
      name: 'city',
      title: 'City',
      type: 'string'
    },
    {
      name: 'locations',
      title: 'Locations Count',
      type: 'string'
    },
    {
      name: 'message',
      title: 'Message Content',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'read',
      title: 'Mark as Read',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'createdAt',
      title: 'Received At',
      type: 'datetime',
      validation: Rule => Rule.required()
    }
  ],
  readOnly: true
}
