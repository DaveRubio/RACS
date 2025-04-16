<template>
  <q-layout view="lHh lpR ffr" no-shadow>
    <q-header elevated class="custom-header">
      <q-toolbar class="justify-end">
        <img
          src="src/assets/user.png"
          alt="ERACS Logo"
          style="width: 55px; height: 50px"
          class="q-mb-sm"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="250"
      :breakpoint="767"
      show-if-above
      class="custom-card-drawer"
    >
      <q-list>
        <q-item class="column items-center q-pt-md">
          <img
            src="src/assets/tagumlogo.png"
            alt="ERACS Logo"
            style="width: 80px; height: 75px"
            class="q-mb-sm"
          />
          <q-item-label class="eracs-title">
            Electronic Registry of Appropriation and Commitment (eRAC)
          </q-item-label>
        </q-item>
        <br />

        <NavLink
          v-for="link in navLinks"
          :key="link.title"
          v-bind="link"
          :expanded="expanded[link.title] || false"
          @toggle="toggleExpand(link.title)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import NavLink from 'components/Nav/NavLink.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
watch(
  () => route.meta.title,
  (newTitle) => {
    document.title = newTitle ? `${newTitle} | ERACS` : 'ERACS'
  },
)

const navLinks = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/home/dashboard',
  },
  {
    title: 'Transactions',
    icon: 'receipt_long',
    children: [
      { title: 'Appropriation', link: '/home/transactions/appropriation' },
      { title: 'Disbursement', link: '/home/transactions/disbursement' },
      { title: 'Augmentation', link: '/home/transactions/augmentation' },
    ],
  },
  {
    title: 'Continuing',
    icon: 'sync',
    children: [
      { title: 'Appropriation', link: '/home/continuing/appropriation' },
      { title: 'Disbursement', link: '/home/continuing/disbursement' },
      { title: 'Augmentation', link: '/home/continuing/augmentation' },
    ],
  },
  {
    title: 'Libraries',
    icon: 'library_books',
    children: [
      { title: 'Accounts', link: '/home/libraries/accounts' },
      { title: 'Particulars', link: '/home/libraries/particulars' },
      { title: 'Bank', link: '/home/libraries/bank' },
      { title: 'Continuing', link: '/home/libraries/continuing' },
    ],
  },
  {
    title: 'Reports',
    icon: 'assessment',
    link: '/home/reports',
  },
]

const leftDrawerOpen = ref(false)

// Track expanded state for each dropdown
const expanded = ref({
  Transactions: false,
  Continuing: false,
  Libraries: false,
})

// Toggle dropdown state
const toggleExpand = (title) => {
  if (Object.hasOwn(expanded.value, title)) {
    expanded.value[title] = !expanded.value[title]
  }
}
</script>

<style>
.custom-card-drawer {
  background: linear-gradient(to bottom, rgb(255, 255, 255), #58b265);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.custom-header {
  background: rgba(223, 237, 225, 1);
}

/* Smooth transitions */
.q-slide-transition {
  transition: max-height 0.9s ease;
}

.eracs-title {
  color: rgba(2, 2, 2, 0.7);
  font-size: 0.95rem;
  font-weight: bolder;
  text-align: center;
}
</style>
