<script setup>
import { ref, watch } from 'vue'
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
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  client: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:open', 'submit'])

const isLoading = ref(false)
const formErrors = ref({})
const form = ref({
  client_name: '',
  notes: '',
  phone: ''
})

const validateForm = () => {
  const errors = {}
  if (!form.value.client_name.trim()) errors.client_name = 'Client name is required'
  if (!form.value.phone.trim()) errors.phone = 'Phone number is required'

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

watch(
  () => props.client,
  (client) => {
    if (client) {
      form.value = {
        client_name: client.client_name,
        notes: client.notes,
        phone: client.phone
      }
    } else {
      form.value = {
        client_name: '',
        notes: '',
        phone: ''
      }
    }
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
</script>

<template>
  <Dialog :open="open" @update:open="(val) => $emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ client ? 'Edit Client' : 'Add New Client' }}
        </DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <!-- Client Name -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="client_name" class="text-right pt-2">
            Client Name <span class="text-red-500">*</span>
          </Label>
          <div class="col-span-3 space-y-1">
            <Input
              id="client_name"
              v-model="form.client_name"
              required
              :class="{ 'border-red-500': formErrors.client_name }"
            />
            <p v-if="formErrors.client_name" class="text-sm text-red-500">
              {{ formErrors.client_name }}
            </p>
          </div>
        </div>

        <!-- Phone -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="phone" class="text-right pt-2">
            Phone <span class="text-red-500">*</span>
          </Label>
          <div class="col-span-3 space-y-1">
            <Input
              id="phone"
              v-model="form.phone"
              required
              :class="{ 'border-red-500': formErrors.phone }"
            />
            <p v-if="formErrors.phone" class="text-sm text-red-500">
              {{ formErrors.phone }}
            </p>
          </div>
        </div>

        <!-- Notes -->
        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="notes" class="text-right pt-2">
            Notes
          </Label>
          <Input
            id="notes"
            v-model="form.notes"
            class="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">
          Cancel
        </Button>
        <Button type="submit" @click="handleSubmit" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          {{ client ? 'Update' : 'Create' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
