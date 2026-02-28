<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navItems = [
  { title: '起訖站查詢', icon: 'mdi-magnify', to: '/' },
  { title: '站點時刻表', icon: 'mdi-clock-outline', to: '/timetable' },
  { title: '路線總覽', icon: 'mdi-map-marker-path', to: '/route' },
]
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title class="font-weight-bold">
        桃園機場捷運查詢
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="pa-4" fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-bottom-navigation grow color="primary">
      <v-btn
        v-for="item in navItems"
        :key="item.to"
        :active="router.currentRoute.value.path === item.to"
        @click="router.push(item.to)"
      >
        <v-icon>{{ item.icon }}</v-icon>
        <span>{{ item.title }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
