<script setup>
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

defineProps({
  open: Boolean,
  title: String,
  description: String,
  onConfirm: Function,
  onCancel: Function
})
</script>

<template>
  <Dialog :open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="onCancel">
          Cancel
        </Button>
        <Button variant="destructive" @click="onConfirm">
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
