<script setup>
import { ref, onMounted } from 'vue'
import ClientsList from '@/components/ClientsList.vue'
import ClientForm from '@/components/ClientForm.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import api from '@/services/api'

const clients = ref([])
const isLoading = ref(false)
const isFormOpen = ref(false)
const currentClient = ref(null)

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

onMounted(() => {
  fetchClients()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Clients</h1>
      <Button @click="openForm()">
        <Plus class="w-4 h-4 mr-2" />
        Add Client
      </Button>
    </div>

    <ClientsList
      :clients="clients"
      :loading="isLoading"
      @edit="openForm"
      @delete="handleDelete"
    />

    <ClientForm
      v-model:open="isFormOpen"
      :client="currentClient"
      @submit="handleSubmit"
    />
  </div>
</template>
