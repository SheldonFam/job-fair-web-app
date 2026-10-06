<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Bot, MessageCircle, SendHorizontal, X, Circle } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const isOpen = ref(false)

const messages = ref<ChatMessage[]>([])

const { t, locale } = useI18n()

const suggestions = ['dates', 'register', 'floorPlan', 'packages']

const messageText = ref('')
const isPending = ref(false)
const messageList = ref<HTMLElement | null>(null)
const messageInput = ref<HTMLElement | null>(null)
const chatButton = ref<HTMLButtonElement | null>(null)

const openChatBot = async () => {
  isOpen.value = true
  await scrollToBottom()
  messageInput.value?.focus()
}

const closeChatBot = async () => {
  isOpen.value = false
  await nextTick()
  chatButton.value?.focus()
}

const scrollToBottom = async () => {
  await nextTick()

  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight
  }
}

const sendMessage = async (text: string) => {
  const content = text.trim()

  if (content === '' || isPending.value) {
    return
  }

  messages.value.push({ role: 'user', content: content })
  messageText.value = ''
  isPending.value = true
  scrollToBottom()

  try {
    const response = await fetch('/api/chat.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.value, language: locale.value }),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      messages.value.push({
        role: 'assistant',
        content: t('chat.error'),
      })
      return
    }

    messages.value.push({ role: 'assistant', content: result.reply })
  } catch (error) {
    console.error(error)
    messages.value.push({
      role: 'assistant',
      content: t('chat.error'),
    })
  } finally {
    isPending.value = false
    scrollToBottom()
  }
}
</script>

<template>
  <button
    v-if="!isOpen"
    ref="chatButton"
    type="button"
    class="chat-button"
    v-bind:aria-label="t('chat.open')"
    v-on:click="openChatBot"
  >
    <MessageCircle v-bind:size="28" aria-hidden="true" />
  </button>

  <section
    v-else
    class="chat-window"
    v-bind:aria-label="t('chat.title')"
    v-on:keydown.esc="closeChatBot"
  >
    <header class="chat-header">
      <span class="chat-avatar" aria-hidden="true">
        <Bot v-bind:size="22" />
      </span>
      <div class="chat-heading">
        <p class="chat-title">{{ t('chat.title') }}</p>
        <p class="chat-status">
          <Circle v-bind:size="8" color="#4ade80" fill="#4ade80" aria-hidden="true" />
          {{ t('chat.online') }}
        </p>
      </div>
      <button
        type="button"
        class="icon-button chat-close"
        v-bind:aria-label="t('chat.close')"
        v-on:click="closeChatBot"
      >
        <X v-bind:size="20" aria-hidden="true" />
      </button>
    </header>

    <div
      ref="messageList"
      class="chat-messages"
      role="log"
      v-bind:aria-label="t('chat.conversation')"
    >
      <p class="chat-message is-assistant">
        {{ t('chat.welcome') }}
      </p>
      <p
        v-for="(message, index) in messages"
        v-bind:key="index"
        class="chat-message"
        v-bind:class="message.role === 'user' ? 'is-user' : 'is-assistant'"
      >
        {{ message.content }}
      </p>

      <!-- TODO: show this only while waiting for a reply -->
      <div v-if="isPending" class="chat-typing" role="status" v-bind:aria-label="t('chat.typing')">
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
      </div>

      <div class="chat-suggestions">
        <button
          v-for="suggestion in suggestions"
          v-bind:key="suggestion"
          type="button"
          class="chat-suggestion"
          v-on:click="sendMessage(t(`chat.suggestions.${suggestion}`))"
        >
          {{ t(`chat.suggestions.${suggestion}`) }}
        </button>
      </div>
    </div>

    <form class="chat-form" v-on:submit.prevent="sendMessage(messageText)">
      <input
        id="chat-message"
        v-model="messageText"
        class="input"
        name="chatMessage"
        type="text"
        autocomplete="off"
        v-bind:placeholder="t('chat.placeholder')"
        v-bind:aria-label="t('chat.inputLabel')"
        ref="messageInput"
      />
      <button
        type="submit"
        class="btn btn-primary chat-send"
        v-bind:aria-label="t('chat.send')"
        v-bind:disabled="isPending"
      >
        <SendHorizontal v-bind:size="20" aria-hidden="true" />
      </button>
    </form>
  </section>
</template>

<style scoped>
/* round button fixed to the bottom right corner */
.chat-button {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border: 0;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: var(--shadow-menu);
  color: var(--white);
  cursor: pointer;
  transition: background 0.15s;
}

.chat-button:hover {
  background: var(--primary-dark);
}

/* the chat window: header, messages, form stacked top to bottom */
.chat-window {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  width: 380px;
  height: 560px;
  max-height: calc(100vh - 48px);
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--surface);
  box-shadow: var(--shadow-menu);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px 12px 16px;
  background: var(--primary);
  color: var(--white);
}

.chat-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--white);
  color: var(--primary);
}

.chat-heading {
  flex: 1;
  line-height: 1.3;
}

.chat-title {
  font-weight: 700;
}

.chat-status {
  font-size: 14px;
}

/* see-through version of the icon button, for the blue header */
.chat-close {
  background: rgba(255, 255, 255, 0.15);
  color: var(--white);
}

.chat-close:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* a white outline, because the usual blue one cannot be seen on the blue header */
.chat-close:focus-visible {
  outline-color: var(--white);
}

/* message list: takes the space left over and scrolls */
.chat-messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
  /* when the list reaches its end, do not start scrolling the page behind it */
  overscroll-behavior: contain;
  background: var(--surface-alt);
}

/* one message bubble; long words wrap so they never push the window wider */
.chat-message {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 16px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

/* assistant on the left, grey */
.chat-message.is-assistant {
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  background: var(--border);
  color: var(--heading);
}

/* user on the right, blue */
.chat-message.is-user {
  align-self: flex-end;
  border-bottom-right-radius: 4px;
  background: var(--primary);
  color: var(--white);
}

/* three bouncing dots while the assistant is replying */
.chat-typing {
  display: flex;
  align-self: flex-start;
  gap: 4px;
  padding: 14px;
  border-radius: 14px 14px 14px 4px;
  background: var(--border);
}

.chat-typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--border-strong);
  animation: chat-typing-bounce 1.2s infinite;
}

.chat-typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.chat-typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes chat-typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
}

/* ready-made questions the user can tap */
.chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chat-suggestion {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid var(--primary);
  border-radius: var(--radius-pill);
  background: var(--surface);
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-dark);
  cursor: pointer;
}

.chat-suggestion:hover {
  background: var(--primary-light);
}

/* input and send button */
.chat-form {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--border);
}

/* square button that only holds the send icon */
.chat-send {
  flex-shrink: 0;
  width: 48px;
  padding: 0;
}

/* people who turn off motion in their system settings see still dots */
@media (prefers-reduced-motion: reduce) {
  .chat-typing-dot {
    animation: none;
  }
}

/* phones: smaller button, and the window fills the screen */
@media (max-width: 640px) {
  .chat-button {
    right: 16px;
    bottom: 16px;
    width: 52px;
    height: 52px;
  }

  .chat-window {
    inset: 0;
    width: auto;
    height: auto;
    max-height: none;
    border-radius: 0;
  }
}
</style>
