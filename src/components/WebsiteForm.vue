<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-vue-next'
import api from '@/services/api'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  website: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:open', 'submit'])

const isLoading = ref(false)
const clients = ref([])
const formErrors = ref({}) // Track validation errors
const form = ref({
  website_name: '',
  url: '',
  client_id: '',
  cms_used: '',
  account_manager: '',
  status: 'active',
  notes: ''
})

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'down', label: 'Down' }
]

// Validation rules
const validateForm = () => {
  const errors = {}
  if (!form.value.website_name.trim()) errors.website_name = 'Website name is required'
  if (!form.value.url.trim()) errors.url = 'URL is required'
  if (!form.value.client_id) errors.client_id = 'Client is required'
  if (!form.value.cms_used.trim()) errors.cms_used = 'CMS/Tech is required'
  if (!form.value.account_manager.trim()) errors.account_manager = 'Account manager is required'

  // URL validation
  if (form.value.url.trim() && !/^https?:\/\/.+\..+/.test(form.value.url)) {
    errors.url = 'Please enter a valid URL (http:// or https://)'
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const fetchClients = async () => {
  try {
    clients.value = await api.getClients()
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.website,
  (website) => {
    if (website) {
      form.value = {
        website_name: website.website_name || '',
        url: website.url || '',
        client_id: website.client_id || '',
        cms_used: website.cms_used || '',
        account_manager: website.account_manager || '',
        status: website.status || 'active',
        notes: website.notes || ''
      }
    } else {
      form.value = {
        website_name: '',
        url: '',
        client_id: '',
        cms_used: '',
        account_manager: '',
        status: 'active',
        notes: ''
      }
    }
    // Clear errors when form resets
    formErrors.value = {}
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    await emit('submit', form.value)
    emit('update:open', false)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchClients()
})
</script>

<template>
  <Dialog :open="open" @update:open="(val) => $emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ website ? 'Edit Website' : 'Add New Website' }}
        </DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <!-- Website Name -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="website_name" class="text-right pt-2">
            Website Name <span class="text-red-500">*</span>
          </Label>
          <div class="col-span-3 space-y-1">
            <Input
              id="website_name"
              v-model="form.website_name"
              required
              :class="{ 'border-red-500': formErrors.website_name }"
            />
            <p v-if="formErrors.website_name" class="text-sm text-red-500">
              {{ formErrors.website_name }}
            </p>
          </div>
        </div>

        <!-- URL -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="url" class="text-right pt-2">
            URL <span class="text-red-500">*</span>
          </Label>
          <div class="col-span-3 space-y-1">
            <Input
              id="url"
              v-model="form.url"
              required
              placeholder="https://example.com"
              :class="{ 'border-red-500': formErrors.url }"
            />
            <p v-if="formErrors.url" class="text-sm text-red-500">
              {{ formErrors.url }}
            </p>
          </div>
        </div>

        <!-- Client -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="client_id" class="text-right pt-2">
            Client <span class="text-red-500">*</span>
          </Label>
          <div class="col-span-3 space-y-1">
            <Select v-model="form.client_id" required>
              <SelectTrigger :class="{ 'border-red-500': formErrors.client_id }">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="client in clients"
                  :key="client.id"
                  :value="client.id"
                >
                  {{ client.client_name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="formErrors.client_id" class="text-sm text-red-500">
              {{ formErrors.client_id }}
            </p>
          </div>
        </div>

        <!-- CMS/Tech -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="cms_used" class="text-right pt-2">
            CMS/Tech <span class="text-red-500">*</span>
          </Label>
          <div class="col-span-3 space-y-1">
            <Input
              id="cms_used"
              v-model="form.cms_used"
              required
              :class="{ 'border-red-500': formErrors.cms_used }"
            />
            <p v-if="formErrors.cms_used" class="text-sm text-red-500">
              {{ formErrors.cms_used }}
            </p>
          </div>
        </div>

        <!-- Account Manager -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="account_manager" class="text-right pt-2">
            Account Manager <span class="text-red-500">*</span>
          </Label>
          <div class="col-span-3 space-y-1">
            <Input
              id="account_manager"
              v-model="form.account_manager"
              required
              :class="{ 'border-red-500': formErrors.account_manager }"
            />
            <p v-if="formErrors.account_manager" class="text-sm text-red-500">
              {{ formErrors.account_manager }}
            </p>
          </div>
        </div>

        <!-- Status -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="status" class="text-right">
            Status
          </Label>
          <Select v-model="form.status" class="col-span-3">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="status in statusOptions"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Notes -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="notes" class="text-right pt-2">
            Notes
          </Label>
          <Textarea id="notes" v-model="form.notes" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">
          Cancel
        </Button>
        <Button type="submit" @click="handleSubmit" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          {{ website ? 'Update' : 'Create' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
