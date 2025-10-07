import { buildConfig as buildPayloadConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildPayloadConfig({
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email' },
      fields: [
        { name: 'name', type: 'text' },
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  db: mongooseAdapter({ url: process.env.MONGODB_URI || '' }),
})

import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
    // Users Collection for Admin Authentication
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'admin',
          options: [
            {
              label: 'Admin',
              value: 'admin',
            },
            {
              label: 'Editor',
              value: 'editor',
            },
          ],
        },
      ],
    },
    // Blog Posts Collection
    {
      slug: 'blog-posts',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'status', 'publishedAt'],
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            description: 'URL-friendly version of the title',
          },
        },
        {
          name: 'body',
          type: 'richText',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
            {
              label: 'Draft',
              value: 'draft',
            },
            {
              label: 'Published',
              value: 'published',
            },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    // Contacts Collection
    {
      slug: 'contacts',
      admin: {
        useAsTitle: 'email',
        defaultColumns: ['email', 'name', 'source', 'status', 'createdAt'],
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: false,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'message',
          type: 'textarea',
          required: false,
        },
        {
          name: 'selectedPlan',
          type: 'select',
          options: [
            { label: 'Core', value: 'core' },
            { label: 'Advanced', value: 'advanced' },
            { label: 'Premium', value: 'premium' },
          ],
        },
        {
          name: 'planName',
          type: 'text',
        },
        {
          name: 'planPrice',
          type: 'number',
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'contact_form',
          options: [
            { label: 'Contact Form', value: 'contact_form' },
            { label: 'Pricing Modal', value: 'pricing_modal' },
            { label: 'Blog Subscribe', value: 'blog_subscribe' },
            { label: 'Authority Engine', value: 'authority_engine' },
          ],
        },
        {
          name: 'ipAddress',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'userAgent',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Converted', value: 'converted' },
            { label: 'Unqualified', value: 'unqualified' },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Internal notes about this contact',
          },
        },
      ],
    },
    // Videos Collection
    {
      slug: 'videos',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'client', 'embedType', 'tags'],
      },
      fields: [
        {
          name: 'videoId',
          type: 'text',
          required: true,
          unique: true,
          label: 'Video ID',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'client',
          type: 'text',
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'embedType',
          type: 'select',
          required: true,
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'MP4', value: 'mp4' },
          ],
        },
        {
          name: 'embedIdOrUrl',
          type: 'text',
          required: true,
          label: 'Embed ID or URL',
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
        {
          name: 'duration',
          type: 'text',
          admin: {
            description: 'Format: MM:SS',
          },
        },
      ],
    },
    // Plans Collection
    {
      slug: 'plans',
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'pricePerMonth', 'termMonths', 'highlight'],
      },
      fields: [
        {
          name: 'planId',
          type: 'text',
          required: true,
          unique: true,
          label: 'Plan ID',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'pricePerMonth',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'termMonths',
          type: 'select',
          required: true,
          options: [
            { label: '4 Months', value: '4' },
            { label: '12 Months', value: '12' },
          ],
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          label: 'Highlight this plan',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'includes',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'bestFor',
          type: 'array',
          required: true,
          label: 'Best For',
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'addOns',
          type: 'array',
          label: 'Add-ons',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'pricePerMonth',
              type: 'number',
              required: true,
              min: 0,
            },
            {
              name: 'description',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'variants',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'select',
              required: true,
              options: [
                { label: '4-month', value: '4-month' },
                { label: '12-month', value: '12-month' },
              ],
            },
            {
              name: 'pricePerMonth',
              type: 'number',
              required: true,
              min: 0,
            },
            {
              name: 'total',
              type: 'number',
              required: true,
              min: 0,
            },
          ],
        },
      ],
    },
    // Media Collection for uploads
    {
      slug: 'media',
      upload: {
        staticDir: path.resolve(dirname, 'public/uploads'),
        mimeTypes: ['image/*', 'video/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Abramovich Media',
    },
  },
})

