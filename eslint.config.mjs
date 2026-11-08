// @ts-check
import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['.cache/**', 'data/**', 'docs/**'],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  prettier,
)
