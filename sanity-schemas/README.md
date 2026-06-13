# Sanity Studio Schemas for NoWaiting App

This directory contains reference schemas for your Sanity CMS Studio. You can copy these files directly into your Sanity Studio project.

## Schema List

1. **`post.js`**: Defines fields for blog articles, including featured flags and rich text (Portable Text) content.
2. **`siteSettings.js`**: Configures global variables for editing copy on the landing page (Hero headlines/descriptions).
3. **`waitlist.js`**: Configures structured data for storing emails signed up for early access.
4. **`contact.js`**: Configures inquiries from partners and general feedback requests.

## How to use

1. Go to your Sanity Studio project directory (or create a new one: `npm create sanity@latest`).
2. Copy these four schema files into the `schemas` or `schemaTypes` folder of your Sanity Studio project.
3. Import and declare them in your main studio configuration schema array (usually `schema/index.js` or `schemaTypes/index.js`):

```javascript
import post from './post'
import siteSettings from './siteSettings'
import waitlist from './waitlist'
import contact from './contact'

export const schemaTypes = [post, siteSettings, waitlist, contact]
```

4. Deploy your Sanity Studio: `npx sanity deploy`.
5. Make sure to generate a **Write Token** in your Sanity project dashboard (under API settings) and add it as `SANITY_WRITE_TOKEN` in your environment variables, along with `VITE_SANITY_PROJECT_ID`.
