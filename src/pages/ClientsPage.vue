<script setup>
import { ref, onMounted, computed } from 'vue'
import ClientsList from '@/components/ClientsList.vue'
import ClientForm from '@/components/ClientForm.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-vue-next'
import api from '@/services/api'

const clients = ref([])
const isLoading = ref(false)
const isFormOpen = ref(false)
const currentClient = ref(null)
const searchQuery = ref('')

const fetchClients = async () => {
  try {
    isLoading.value = true
    clients.value = await api.getClients()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Filter clients based on search query
const filteredClients = computed(() => {
  if (!searchQuery.value.trim()) {
    return clients.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  return clients.value.filter(client =>
    client.client_name.toLowerCase().includes(query) ||
    client.phone.toLowerCase().includes(query) ||
    client.notes.toLowerCase().includes(query)
  )
})

const openForm = (client = null) => {
  currentClient.value = client
  isFormOpen.value = true
}

const handleSubmit = async (clientData) => {
  try {
    if (currentClient.value) {
      await api.updateClient(currentClient.value.id, clientData)
    } else {
      await api.createClient(clientData)
    }
    await fetchClients()
    isFormOpen.value = false
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (id) => {
  try {
    await api.deleteClient(id)
    await fetchClients()
  } catch (error) {
    console.error(error)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

onMounted(() => {
  fetchClients()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold">Clients</h1>
        <p class="text-sm text-gray-500 mt-1">
          Manage your clients and their information
        </p>
      </div>
      <Button @click="openForm()" class="whitespace-nowrap">
        <Plus class="w-4 h-4 mr-2" />
        Add Client
      </Button>
    </div>

    <!-- Search Section -->
    <div class="relative">
      <div class="relative max-w-sm">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          v-model="searchQuery"
          placeholder="Search clients by name, phone, or notes..."
          class="pl-10 pr-10"
        />
        <Button
          v-if="searchQuery"
          variant="ghost"
          size="icon"
          class="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
          @click="clearSearch"
        >
          <span class="text-sm">×</span>
        </Button>
      </div>

      <!-- Search Results Info -->
      <div v-if="searchQuery" class="mt-2 text-sm text-gray-500">
        Showing {{ filteredClients.length }} of {{ clients.length }} clients
        <Button variant="link" @click="clearSearch" class="ml-2 h-auto p-0">
          Clear search
        </Button>
      </div>
    </div>

    <!-- Clients List -->
    <ClientsList
      :clients="filteredClients"
      :loading="isLoading"
      @edit="openForm"
      @delete="handleDelete"
    />

    <!-- Client Form -->
    <ClientForm
      v-model:open="isFormOpen"
      :client="currentClient"
      @submit="handleSubmit"
    />
  </div>
</template>
