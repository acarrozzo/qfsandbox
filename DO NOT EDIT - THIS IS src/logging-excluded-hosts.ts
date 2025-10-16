export const excludedHosts = ['localhost', 'local.magicsky.dev'] // exclude from logging on both the front-end and back-end

export const frontEndExcludedHosts = [...excludedHosts] // exclude from logging only on the front-end

export const backEndExcludedHosts = [...excludedHosts] // exclude from logging only on the back-end
