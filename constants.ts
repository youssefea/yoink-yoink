export const URL = process.env.ENVIRONMENT === 'local' ?
process.env.LOCALHOST : process.env.PROD_URL

export const DEBUGGER_HUB_URL =
process.env.ENVIRONMENT === 'local' ?
  process.env.LOCAL_DEBUGGER_HUB_URL : process.env.PROD_HUB_URL