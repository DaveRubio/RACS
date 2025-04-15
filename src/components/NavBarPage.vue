<template>
  <q-header elevated class="navbar">
    <q-toolbar>
      <q-space />
      <q-btn round flat icon="account_circle">
        <q-menu>
          <q-list>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Log Out</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script>
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    const logout = async () => {
      try {
        const token = localStorage.getItem('token')

        await api.post(
          '/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        localStorage.removeItem('token')
        router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    return {
      logout,
    }
  },
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(to right, #c8e6c9, #c8e6c9, #c8e6c9) !important;
  color: #000000;
}
</style>
