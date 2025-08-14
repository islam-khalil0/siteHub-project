<script setup>
import { ref, onMounted } from 'vue'
import WebsitesList from '@/components/WebsitesList.vue'
import WebsiteForm from '@/components/WebsiteForm.vue'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import api from '@/services/api'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'


const websites = ref([])
const clients = ref([]) // Add clients ref
const isLoading = ref(false)
const isFormOpen = ref(false)
const currentWebsite = ref(null)

const fetchData = async () => {
  try {
    isLoading.value = true
    // Fetch both websites and clients simultaneously
    const [websitesRes, clientsRes] = await Promise.all([
      api.getWebsites(),
      api.getClients()
    ])
    websites.value = websitesRes
    clients.value = clientsRes
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const openForm = (website = null) => {
  currentWebsite.value = website
  isFormOpen.value = true
}

const handleSubmit = async (websiteData) => {
  try {
    if (currentWebsite.value) {
      await api.updateWebsite(currentWebsite.value.id, websiteData)
    } else {
      await api.createWebsite(websiteData)
    }
    await fetchData() // Use fetchData instead of fetchWebsites to refresh both
    isFormOpen.value = false
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (id) => {
  try {
    await api.deleteWebsite(id)
    await fetchData() // Use fetchData instead of fetchWebsites to refresh both
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Websites</h1>
      <Button @click="openForm()">
        <Plus class="w-4 h-4 mr-2" />
        Add Website
      </Button>
    </div>

    <WebsitesList :websites="websites" :clients="clients" :loading="isLoading" @edit="openForm"
      @delete="handleDelete" />

    <WebsiteForm v-model:open="isFormOpen" :website="currentWebsite" @submit="handleSubmit" />
  </div>
   <ConfirmDialog
    v-if="confirmState"
    :open="confirmState.isOpen"
    :title="confirmState.title"
    :description="confirmState.description"
    @onConfirm="confirmState.onConfirm"
    @onCancel="confirmState.onCancel"
  />
</template>
