import {defineCliConfig} from 'sanity/cli'

// Load environment variables from parent directory's .env.local
// config({path: '.env.local'})
// TODO remove dep?

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
    dataset: process.env.SANITY_STUDIO_DATASET ?? '',
  },

  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    appId: process.env.APP_ID || '',
    autoUpdates: true,
  },
})
