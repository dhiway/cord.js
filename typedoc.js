module.exports = {
  exclude: [
    'demo/**/**',
    '**/*spec.ts',
    '**/__mocks__/**',
    '**/testingTools/**',
    '**/*.js',
    '**/node_modules/**',
    '**/__integrationtests__/**',
    '**/index.ts',
  ],
  entryPoints: [
    "packages/api/src/index.ts"
  ],
  excludeExternals: true,
  //excludeNotExported: true,
  excludePrivate: true,
  //stripInternal: true,
  hideGenerator: true,
  name: '@cord.network/api',
  validation: {
    invalidLink: true,
  },
  tsconfig: 'tsconfig.json',
  readme: 'README.md',
}
