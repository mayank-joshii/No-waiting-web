import { defineType, defineField } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description: 'Recommended size: 800 x 600 px (landscape - aspect ratio 4:3). Used as the cover image.',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A brief summary of the article displayed in lists.',
      validation: Rule => Rule.required()
    }),
    defineField({
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
    }),
    defineField({
      name: 'date',
      title: 'Publish Date',
      type: 'date',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'read',
      title: 'Reading Time',
      type: 'string',
      description: 'e.g. "5 min"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Highlight this article at the top of the blog page.'
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: Rule => Rule.required()
    })
  ]
})
