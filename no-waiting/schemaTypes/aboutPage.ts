import { defineType, defineField } from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Main Eyebrow',
      type: 'string',
      description: 'e.g. "Our Story"',
      initialValue: 'Our Story',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'titleLine1',
      title: 'Headline Line 1',
      type: 'string',
      description: 'e.g. "Built for diners."',
      initialValue: 'Built for diners.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'titleLine2',
      title: 'Headline Line 2',
      type: 'string',
      description: 'e.g. "Designed for restaurants."',
      initialValue: 'Designed for restaurants.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Main Description Paragraph',
      type: 'text',
      description: 'The story introduction paragraph text.',
      initialValue: "We started NoWaiting with one question — why are we still standing in lines for dinner? Today, we're building the modern dining infrastructure that makes waiting a thing of the past.",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'missionTitle',
      title: 'Mission Title',
      type: 'string',
      initialValue: 'Mission',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'missionBody',
      title: 'Mission Body Content',
      type: 'text',
      initialValue: 'Eliminate friction between people and the food they love by making every dining decision instant, informed and effortless.',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'visionTitle',
      title: 'Vision Title',
      type: 'string',
      initialValue: 'Vision',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'visionBody',
      title: 'Vision Body Content',
      type: 'text',
      initialValue: "A world where no one waits in a queue — where every meal feels intentional, every reservation is seamless, and every restaurant runs smarter.",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'problemEyebrow',
      title: 'Problem Section Eyebrow',
      type: 'string',
      initialValue: 'The Problem',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'problemTitleLine1',
      title: 'Problem Section Headline Line 1',
      type: 'string',
      initialValue: "Dining out shouldn't",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'problemTitleLine2',
      title: 'Problem Section Headline Line 2 (Lime)',
      type: 'string',
      initialValue: "feel like a guessing game.",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'problemItems',
      title: 'Problem List Statements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of problem statements or bullet facts describing issues with queues.',
      initialValue: [
        "You drive across town only to find a 45-minute wait.",
        "You call ahead — no one picks up. You walk in — the host can't say when you'll sit.",
        "Restaurants lose 20%+ of their potential covers to walk-aways and miscommunication.",
        "Diners and operators both lose. That's the system we're rebuilding."
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'whyEyebrow',
      title: 'Why Section Eyebrow',
      type: 'string',
      initialValue: 'Why NoWaiting',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'whyTitleLine1',
      title: 'Why Section Title Line 1',
      type: 'string',
      initialValue: "Because your time",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'whyTitleLine2',
      title: 'Why Section Title Line 2 (Lime)',
      type: 'string',
      initialValue: "is precious.",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'whyDescription',
      title: 'Why Section Subtitle Description',
      type: 'text',
      initialValue: "Every minute spent in a queue is a minute not spent enjoying your meal, your company, or your evening. We're here to give that time back.",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'aboutImage',
      title: 'Illustrative About Photo',
      type: 'image',
      description: 'Recommended size: 800 x 600 px (landscape). An optional background or team photo.',
      options: { hotspot: true }
    })
  ]
})
