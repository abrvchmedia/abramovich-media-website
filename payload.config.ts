import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000',
  editor: lexicalEditor(),
  collections: [
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
      ],
    },
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
          name: 'source',
          type: 'select',
          defaultValue: 'contact_form',
          options: [
            { label: 'Contact Form', value: 'contact_form' },
            { label: 'Pricing Modal', value: 'pricing_modal' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Converted', value: 'converted' },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      slug: 'videos',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
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
          type: 'text',
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
        },
      ],
    },
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
})