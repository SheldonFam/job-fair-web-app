<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <p class="footer-brand">CareerConnect</p>
        <p>
          Malaysia’s three-day hiring fair connecting job seekers with 150+ employers in Kuala
          Lumpur.
        </p>
      </div>

      <nav aria-label="Footer">
        <h2 class="footer-title">Quick links</h2>
        <ul class="footer-list">
          <li><a href="#floorplan" class="footer-link">Floor plan</a></li>
          <li><a href="#sessions" class="footer-link">Sessions</a></li>
          <li><a href="#faq" class="footer-link">FAQ</a></li>
          <li><a href="#contact" class="footer-link">Contact</a></li>
        </ul>
      </nav>

      <div>
        <h2 class="footer-title">Contact</h2>
        <ul class="footer-list">
          <li><a href="tel:+60327158800" class="footer-link">+60 3-2715 8800</a></li>
          <li>
            <a href="mailto:hello@careerconnect.example.my" class="footer-link">
              hello@careerconnect.example.my
            </a>
          </li>
          <li>Halls A–C, Kuala Lumpur</li>
        </ul>
      </div>

      <form v-on:submit.prevent>
        <label for="newsletter-email" class="footer-title">Get job fair updates</label>
        <div class="footer-newsletter">
          <input
            id="newsletter-email"
            v-model="email"
            class="footer-input"
            type="email"
            required
            placeholder="Your email"
          />
          <button type="submit" class="btn btn-primary">Join</button>
        </div>
      </form>
    </div>

    <div class="container footer-bottom">
      <p>© 2026 CareerConnect. All rights reserved.</p>
      <ul class="footer-legal">
        <li><a href="#" class="footer-link">Privacy</a></li>
        <li><a href="#" class="footer-link">Terms</a></li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
/* the footer is the only dark area, so its colours are named here */
.footer {
  --footer-text: #cbd5e1;
  --footer-muted: #94a3b8;
  --footer-line: #1e293b;

  background: var(--heading);
  color: var(--footer-text);
  font-size: 14px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.8fr 1.4fr 1.4fr;
  gap: 40px;
  padding-block: 56px;
}

.footer-brand {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 800;
  color: var(--white);
}

/* column headings (also used on the newsletter label) */
.footer-title {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.6;
  letter-spacing: 0;
  color: var(--white);
}

.footer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-link {
  color: inherit;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.footer-link:hover {
  color: var(--white);
  text-decoration: underline;
}

/* newsletter */
.footer-newsletter {
  display: flex;
  gap: 8px;
}

.footer-input {
  flex: 1;
  min-width: 0;
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid var(--body);
  border-radius: var(--radius);
  background: var(--footer-line);
  color: var(--white);
}

.footer-input::placeholder {
  color: var(--footer-muted);
}

/* a lighter outline so keyboard focus is visible on the dark background */
.footer :focus-visible {
  outline-color: #93c5fd;
}

/* copyright row */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 20px;
  border-top: 1px solid var(--footer-line);
  font-size: 13px;
  color: var(--footer-muted);
}

.footer-legal {
  display: flex;
  gap: 20px;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    padding-block: 40px;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
