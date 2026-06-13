import { defineType, defineField } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitleLine1',
      title: 'Hero Title Line 1 (White)',
      type: 'string',
      description: 'e.g. "Skip the Queue."',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'heroTitleLine2',
      title: 'Hero Title Line 2 (Lime Gradient)',
      type: 'string',
      description: 'e.g. "Enjoy More."',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'The description block shown directly below the main title.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'heroImageLeft',
      title: 'Hero Phone Mockup Left',
      type: 'image',
      description: 'Recommended size: 480 x 1024 px (portrait - aspect ratio 9:19.2). Usually displays the restaurant list screen.',
      options: { hotspot: true }
    }),
    defineField({
      name: 'heroImageCenter',
      title: 'Hero Phone Mockup Center (Front)',
      type: 'image',
      description: 'Recommended size: 480 x 1024 px (portrait - aspect ratio 9:19.2). Usually displays the logo splash screen.',
      options: { hotspot: true }
    }),
    defineField({
      name: 'heroImageRight',
      title: 'Hero Phone Mockup Right',
      type: 'image',
      description: 'Recommended size: 480 x 1024 px (portrait - aspect ratio 9:19.2). Usually displays the order tracking screen.',
      options: { hotspot: true }
    }),
    defineField({
      name: 'showcaseBanner',
      title: 'App Showcase Billboard Banner',
      type: 'image',
      description: 'Recommended size: 1200 x 600 px (landscape - aspect ratio 2:1). Large banner showing app features.',
      options: { hotspot: true }
    })
  ]
})
