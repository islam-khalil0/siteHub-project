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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Edit, Trash2, Loader2 } from 'lucide-vue-next'

defineProps({
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

// Confirmation dialog state
const showConfirmDialog = ref(false)
const clientToDelete = ref(null)

const handleDeleteClick = (client) => {
  clientToDelete.value = client
  showConfirmDialog.value = true
}

const confirmDelete = () => {
  if (clientToDelete.value) {
    emit('delete', clientToDelete.value.id)
  }
  showConfirmDialog.value = false
  clientToDelete.value = null
}

const cancelDelete = () => {
  showConfirmDialog.value = false
  clientToDelete.value = null
}
</script>

<template>
  <div class="rounded-md border">
    <Table>
      <TableCaption v-if="clients.length === 0 && !loading">
        No clients found.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Client Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="4" class="text-center">
            <Loader2 class="w-8 h-8 mx-auto animate-spin" />
          </TableCell>
        </TableRow>
        <TableRow v-for="client in clients" :key="client.id">
          <TableCell>{{ client.client_name }}</TableCell>
          <TableCell>{{ client.phone }}</TableCell>
          <TableCell>{{ client.notes }}</TableCell>
          <TableCell>
            <div class="flex space-x-2">
              <Button variant="ghost" size="sm" @click="$emit('edit', client)">
                <Edit class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" @click="handleDeleteClick(client)">
                <Trash2 class="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Confirmation Dialog -->
    <Dialog v-model:open="showConfirmDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            When you delete a client, all of that client's websites will be deleted. Are you sure you want to delete {{
              clientToDelete?.client_name }}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="cancelDelete">Cancel</Button>
          <Button variant="destructive" @click="confirmDelete">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
