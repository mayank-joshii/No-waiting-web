export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Make it a singleton (only one configuration document can exist)
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'heroTitleLine1',
      title: 'Hero Title Line 1 (White)',
      type: 'string',
      description: 'e.g. "Skip the Queue."',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroTitleLine2',
      title: 'Hero Title Line 2 (Lime Gradient)',
      type: 'string',
      description: 'e.g. "Enjoy More."',
      validation: Rule => Rule.required()
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'The description block shown directly below the main title.',
      validation: Rule => Rule.required()
    }
  ]
}
