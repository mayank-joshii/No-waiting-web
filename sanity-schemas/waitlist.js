export default {
  name: 'waitlist',
  title: 'Waitlist Lead',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'createdAt',
      title: 'Joined At',
      type: 'datetime',
      validation: Rule => Rule.required()
    }
  ],
  readOnly: true // Waitlists are managed from code
}
