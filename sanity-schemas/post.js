export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A brief summary of the article displayed in lists.',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'Restaurant Technology',
          'Dining Tips',
          'Queue Management',
          'Hospitality Industry',
          'Food Trends'
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Publish Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'read',
      title: 'Reading Time',
      type: 'string',
      description: 'e.g. "5 min"',
      validation: Rule => Rule.required()
    },
    {
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Highlight this article at the top of the blog page.'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: Rule => Rule.required()
    }
  ]
}
