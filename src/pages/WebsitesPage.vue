<script setup>
import { ref, onMounted, computed } from 'vue'
import WebsitesList from '@/components/WebsitesList.vue'
import WebsiteForm from '@/components/WebsiteForm.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search } from 'lucide-vue-next'
import api from '@/services/api'

const websites = ref([])
const clients = ref([])
const isLoading = ref(false)
const isFormOpen = ref(false)
const currentWebsite = ref(null)

// Search and filter states
const searchQuery = ref('')
const statusFilter = ref('all')
const accountManagerFilter = ref('all')

const fetchData = async () => {
  try {
    isLoading.value = true
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

// Get unique account managers for filter dropdown
const accountManagers = computed(() => {
  const managers = new Set()
  websites.value.forEach(website => {
    if (website.account_manager) {
      managers.add(website.account_manager)
    }
  })
  return Array.from(managers).sort()
})

// Filter websites based on search and filters
const filteredWebsites = computed(() => {
  let filtered = websites.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(website =>
      website.website_name.toLowerCase().includes(query) ||
      website.url.toLowerCase().includes(query) ||
      website.cms_used.toLowerCase().includes(query) ||
      website.account_manager.toLowerCase().includes(query) ||
      website.notes.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(website => website.status === statusFilter.value)
  }

  // Apply account manager filter
  if (accountManagerFilter.value !== 'all') {
    filtered = filtered.filter(website => website.account_manager === accountManagerFilter.value)
  }

  return filtered
})

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
    await fetchData()
    isFormOpen.value = false
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (id) => {
  try {
    await api.deleteWebsite(id)
    await fetchData()
  } catch (error) {
    console.error(error)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  accountManagerFilter.value = 'all'
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold">Websites</h1>
        <p class="text-sm text-gray-500 mt-1">
          Manage websites and their details
        </p>
      </div>
      <Button @click="openForm()" class="whitespace-nowrap">
        <Plus class="w-4 h-4 mr-2" />
        Add Website
      </Button>
    </div>

    <!-- Search and Filter Section -->
    <div class="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Input -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input v-model="searchQuery" placeholder="Search websites..." class="pl-10" />
        </div>

        <!-- Status Filter -->
        <Select v-model="statusFilter">
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="down">Down</SelectItem>
          </SelectContent>
        </Select>

        <!-- Account Manager Filter -->
        <Select v-model="accountManagerFilter">
          <SelectTrigger>
            <SelectValue placeholder="Filter by account manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Account Managers</SelectItem>
            <SelectItem v-for="manager in accountManagers" :key="manager" :value="manager">
              {{ manager }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Filter Info and Clear Button -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div class="text-sm text-gray-500">
          Showing {{ filteredWebsites.length }} of {{ websites.length }} websites
          <span v-if="searchQuery || statusFilter !== 'all' || accountManagerFilter !== 'all'" class="ml-2">
            (filtered)
          </span>
        </div>

        <Button v-if="searchQuery || statusFilter !== 'all' || accountManagerFilter !== 'all'" variant="outline"
          size="sm" @click="clearFilters">
          Clear all filters
        </Button>
      </div>
    </div>

    <!-- Websites List -->
    <WebsitesList :websites="filteredWebsites" :clients="clients" :loading="isLoading" @edit="openForm"
      @delete="handleDelete" />

    <!-- Website Form -->
    <WebsiteForm v-model:open="isFormOpen" :website="currentWebsite" @submit="handleSubmit" />
  </div>
</template>
