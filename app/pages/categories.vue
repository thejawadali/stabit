<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Organize your habits with custom categories</p>
      </div>
      <Button @click="openCreateDialog" class="flex items-center gap-2">
        <IconPlus class="h-4 w-4" />
        Add Category
      </Button>
    </div>

    <!-- Categories Grid -->
    <div v-if="categories?.length! > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card v-for="category in categories" :key="category.id" class="group hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                :style="{ backgroundColor: category.color }">
                {{ category.icon || '📁' }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ category.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.habitsCount }} habits</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconMoreHorizontal class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="openEditDialog(category)">
                  <IconEdit class="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem @click="deleteCategory(category.id)" class="text-red-600" :disabled="category.habitsCount > 0">
                  <IconTrash class="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p v-if="category.description" class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ category.description }}
          </p>

          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Created {{ formatDate(category.createdAt) }}</span>
            <Badge :variant="category.isActive ? 'default' : 'secondary'">
              {{ category.isActive ? 'Active' : 'Inactive' }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <IconTags class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No categories yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Create your first category to organize your habits</p>
      <Button @click="openCreateDialog">
        <IconPlus class="h-4 w-4 mr-2" />
        Create Category
      </Button>
    </div>

    <!-- Create/Edit Category Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit Category' : 'Create Category' }}</DialogTitle>
          <DialogDescription>
            {{ isEditing ? 'Update your category details' : 'Add a new category to organize your habits' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <!-- Name -->
          <Input name="name" id="name" label="Name" v-model="form.name" placeholder="e.g., Health & Fitness" rules="required" />

          <!-- Description -->
          <Textarea label="Description (Optional)" id="description" v-model="form.description"
            placeholder="Describe this category..." rows="3" />

          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="color">Color</Label>
              <div class="flex items-center gap-2">
                <input id="color" v-model="form.color" type="color"
                  class="w-12 h-10 rounded border border-gray-300 dark:border-gray-600" />
                <Input v-model="form.color" placeholder="#3B82F6" class="flex-1" />
              </div>
            </div>

            <!-- Icon -->
            <IconPicker name="categoryIcon" label="Icon" v-model="form.icon" />
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox id="isActive" v-model:checked="form.isActive" />
            <Label for="isActive">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="closeDialog">
              Cancel
            </Button>
            <Button type="submit" :disabled="loading">
              {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"

const {validate} = useForm()

const { toast } = useToast()

const isDialogOpen = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const currentCategoryId = ref<string | null>(null)

const form = ref({
  name: '',
  description: '',
  color: '#3B82F6',
  icon: '💪',
  isActive: true
})

const openCreateDialog = () => {
  isEditing.value = false
  currentCategoryId.value = null
  form.value = {
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '💪',
    isActive: true
  }
  isDialogOpen.value = true
}

const openEditDialog = (category: Category) => {
  isEditing.value = true
  currentCategoryId.value = category.id
  form.value = {
    name: category.name,
    description: category.description || '',
    color: category.color,
    icon: category.icon || '',
    isActive: category.isActive
  }
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  isEditing.value = false
  currentCategoryId.value = null
}

const saveCategory = async () => {
  const { valid } = await validate()
  if (!valid) return
  loading.value = true
  try {
    const url = isEditing.value
      ? `/api/categories/${currentCategoryId.value}`
      : '/api/categories'

    const method = isEditing.value ? 'PUT' : 'POST'

    const response = await $fetch<Category>(url, {
      method,
      body: form.value
    })

    if (isEditing.value) {
      const index = categories.value?.findIndex(c => c.id === currentCategoryId.value) as number
      if (index !== -1 && categories.value) {
        categories.value[index] = response
      }
    } else {
      categories.value?.push(response)
    }

    closeDialog()
  } catch (error) {
    console.error('Error saving category:', error)
    // You might want to show a toast notification here
  } finally {
    loading.value = false
  }
}
const { confirm } = useConfirm()

const deleteCategory = async (id: string) => {
  const confirmed = await confirm({
    title: 'Delete Category?',
    description: 'Are you sure you want to delete this category? BHSK',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/categories/${id}`, {
      method: 'DELETE'
    })

    categories.value = categories.value?.filter(c => c.id !== id)
    toast({
      title: 'Category deleted',
      description: 'The category has been deleted successfully.',
    })
  } catch (error: any) {
    console.error('Error deleting category:', error)
    const errorMessage = error?.data?.message || error?.message || 'Failed to delete category. Please try again.'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    })
  }
}


const { data: categories, error } = await useFetch<Category[]>('/api/categories')

const formatDate = (dateString: Date) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

// Set page title
useHead({
  title: 'Categories'
})


</script>
