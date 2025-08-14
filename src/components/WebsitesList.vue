<script setup>
import { ref } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  websites: {
    type: Array,
    default: () => []
  },
  clients: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])

const getClientName = (website) => {
  const client = props.clients.find(c => c.id === website.client_id)
  return client?.client_name || 'No client assigned'
}

const getStatusClasses = (status) => {
  return {
    'active': 'bg-green-100 text-green-800',
    'maintenance': 'bg-yellow-100 text-yellow-800',
    'down': 'bg-red-100 text-red-800'
  }[status] || ''
}
</script>

<template>
  <div class="rounded-md border">
    <Table>
      <!-- Table Caption -->
      <TableCaption v-if="!websites.length && !loading">
        No websites found.
      </TableCaption>

      <!-- Table Header -->
      <TableHeader>
        <TableRow>
          <TableHead>Website Name</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>CMS/Tech</TableHead>
          <TableHead>Account Manager</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <!-- Table Body -->
      <TableBody>
        <!-- Loading State -->
        <TableRow v-if="loading">
          <TableCell colspan="8" class="text-center">
            <Loader2 class="w-8 h-8 mx-auto animate-spin" />
          </TableCell>
        </TableRow>

        <!-- Website Rows -->
        <TableRow v-for="website in websites" :key="website.id">
          <TableCell>{{ website.website_name }}</TableCell>
          <TableCell>{{ getClientName(website) }}</TableCell>
          <TableCell>
            <a :href="website.url" target="_blank" class="text-blue-600 hover:underline">
              {{ website.url }}
            </a>
          </TableCell>
          <TableCell>{{ website.cms_used }}</TableCell>
          <TableCell>{{ website.account_manager }}</TableCell>
          <TableCell class="max-w-[200px] truncate" :title="website.notes">
            {{ website.notes }}
          </TableCell>
          <TableCell>
            <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClasses(website.status)">
              {{ website.status }}
            </span>
          </TableCell>
          <TableCell>
            <div class="flex space-x-2">
              <Button variant="ghost" size="sm" @click="$emit('edit', website)">
                <Edit class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" @click="$emit('delete', website.id)">
                <Trash2 class="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
