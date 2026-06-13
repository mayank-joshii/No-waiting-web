import { defineType, defineField } from 'sanity'

export const serviceType = defineType({
  name: 'service',
  title: 'Service Superpower',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      description: 'e.g. "Restaurant Discovery"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'e.g. "Find your next favorite — not just another place to eat."',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'icon',
      title: 'Lucide Icon Name',
      type: 'string',
      description: 'The name of any Lucide icon, e.g. "Compass", "Clock3", "Users", "CalendarCheck", "Utensils", "ShoppingBag", "Bell", "BarChart3". Case-sensitive.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'bullets',
      title: 'Bullet Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of features/bullets for this service.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'useCase',
      title: 'Use Case Example',
      type: 'text',
      description: 'e.g. "Add yourself to the queue, walk around, and arrive right as your table opens up."',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Phone Screen Mockup Image',
      type: 'image',
      description: 'Recommended size: 480 x 1024 px (portrait - aspect ratio 9:19.2). Upload screen preview matching this service.',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers will appear first in the services page list.',
      initialValue: 0,
      validation: Rule => Rule.required()
    })
  ]
})
