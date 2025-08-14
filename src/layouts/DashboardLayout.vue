<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/components/ui/menubar'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Globe,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const isSidebarOpen = ref(false)

const menuItems = [
  { name: 'Clients', icon: Users, route: 'clients' },
  { name: 'Websites', icon: Globe, route: 'websites' }
]

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="hidden md:flex flex-col w-64 bg-white border-r">
      <div class="flex items-center justify-center h-16 border-b">
        <h1 class="text-xl font-semibold text-gray-800">SiteHub</h1>
      </div>
      <div class="flex flex-col flex-grow p-4 overflow-auto">
        <nav class="flex-1 space-y-2">
          <RouterLink v-for="item in menuItems" :key="item.name" :to="{ name: item.route }"
            class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
            active-class="bg-gray-100 text-gray-900">
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </nav>
      </div>
      <div class="p-4 border-t">
        <Button @click="logout" variant="ghost" class="w-full">
          <LogOut class="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
      <div class="flex items-center justify-center pb-2">
        <p class="text-xs">
          Developed by
          <a href="mailto:eslamkhalil851@gmail.com">Eslam Khalil</a>
        </p>
      </div>
    </div>

    <!-- Mobile sidebar -->
    <div v-if="isSidebarOpen" class="fixed inset-0 z-40 md:hidden">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="isSidebarOpen = false"></div>
      <div class="relative flex flex-col w-3/4 max-w-xs bg-white">
        <div class="flex items-center justify-center h-16 border-b">
          <h1 class="text-xl font-semibold text-gray-800">SiteHub</h1>
        </div>
        <div class="flex flex-col flex-grow p-4 overflow-auto">
          <nav class="flex-1 space-y-2">
            <RouterLink v-for="item in menuItems" :key="item.name" :to="{ name: item.route }"
              class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
              active-class="bg-gray-100 text-gray-900" @click="isSidebarOpen = false">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.name }}</span>
            </RouterLink>
          </nav>
        </div>
        <div class="p-4 border-t">
          <Button @click="logout" variant="ghost" class="w-full">
            <LogOut class="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Header -->
      <header class="flex items-center justify-between h-16 px-4 bg-white border-b">
        <Button variant="ghost" size="icon" class="md:hidden" @click="isSidebarOpen = true">
          <LayoutDashboard class="w-5 h-5" />
        </Button>
        <div class="flex items-center space-x-4">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger class="cursor-pointer">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">
                      {{ authStore.user?.email?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <span class="hidden md:inline">{{ authStore.user?.email }}</span>
                </div>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem @click="logout">
                  <LogOut class="w-4 h-4 mr-2" />
                  Logout
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto p-4 bg-gray-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>
