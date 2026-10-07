import { nextTick, watch, type Ref } from 'vue'

const focusableItems = 'a[href], button:not(:disabled), input, select, textarea'

/* Shared behaviour for anything that opens on top of the page (mobile menu, modal):
   - locks the page scroll while it is open
   - moves the keyboard focus in, and back to where it was on close
   - keeps the Tab key inside the panel */
export const useModal = (isOpen: () => boolean, panel: Ref<HTMLElement | null>) => {
  let previousFocus: HTMLElement | null = null

  const onOpen = async () => {
    previousFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    await nextTick()
    panel.value?.querySelector<HTMLElement>(focusableItems)?.focus()
  }

  const onClose = () => {
    document.body.style.overflow = ''
    previousFocus?.focus()
  }

  watch(isOpen, (open) => {
    if (open) onOpen()
    else onClose()
  })

  const keepFocusInside = (event: KeyboardEvent) => {
    const items = panel.value?.querySelectorAll<HTMLElement>(focusableItems)
    if (!items) return

    const first = items[0]
    const last = items[items.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return { keepFocusInside }
}
