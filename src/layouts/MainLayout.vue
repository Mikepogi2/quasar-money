<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div class="flex justify-center items-center">
            <q-icon name="savings" class="q-mr-sm"/>
            Money Tracker
          </div>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      :width="250"
      :breakpoint="750"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      class="bg-primary"
    >
      <q-list>
        <q-item-label
          header
          class="text-white"
        >
          Navigations
        </q-item-label>

        <NavLink
          v-for="link in navLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-btn icon="play_circle" round class="absolute btn-drawer" color="white" dense flat @click="playMusic"/>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import NavLink from 'src/components/Nav/NavLink.vue'

defineOptions({
  name: 'MainLayout'
})

const isPlaying = ref(false)
const miniState = ref(true)
const audioRef = ref(null)

const navLinks = [
  {
    title: 'Entries',
    icon: 'attach_money',
    link: '/'
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings'
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const playMusic = () => {
  if (!audioRef.value) {
    audioRef.value = new Audio('src/assets/newJeans.mp3')
  }

  if (!isPlaying.value) {
    console.log(isPlaying.value)
    audioRef.value.play()
    isPlaying.value = true
    console.log(isPlaying.value)
  } else {
    audioRef.value.pause()
    isPlaying.value = false
  }
}
</script>

<style scoped>

.btn-drawer {
  transform: translateX(30%)
}

</style>
