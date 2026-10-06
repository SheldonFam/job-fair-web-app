// Everything about the page language lives here: the texts, the start language and switching.
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ms from './locales/ms.json'

export const languages = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'ms', label: 'Bahasa Melayu', shortLabel: 'BM' },
]

const getSavedLanguage = () => {
  const saved = localStorage.getItem('language')
  return saved === 'ms' ? 'ms' : 'en'
}

const savedLanguage = getSavedLanguage()
document.documentElement.lang = savedLanguage

export const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages: { en, ms },
})

document.title = i18n.global.t('header.pageTitle')

export const setLanguage = (language: string) => {
  if (language !== 'en' && language !== 'ms') return

  i18n.global.locale.value = language
  document.documentElement.lang = language
  localStorage.setItem('language', language)
  document.title = i18n.global.t('header.pageTitle')
}
