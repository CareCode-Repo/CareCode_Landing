import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**'] },
  ...fixupConfigRules(compat.extends('next/core-web-vitals', 'next/typescript')),
]

export default eslintConfig
