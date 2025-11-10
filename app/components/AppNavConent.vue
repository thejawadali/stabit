<template>
  <!-- empty div as placeholder -->
  <div />
  <div class="flex items-center space-x-4">
    <!-- Theme Toggle -->
    <ThemeToggle />

    <!-- Notifications Dropdown -->
    <!-- Hidden for MVP -->
    <DropdownMenu v-if="false">
      <DropdownMenuTrigger>
        <button class="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition">
          <IconBell class="w-5 h-5" />
          <span
v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-destructive text-destructive-foreground rounded-full">
            {{ notificationCount }}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          v-for="(n, i) in notifications" :key="i"
          class="p-3 hover:bg-muted cursor-pointer flex flex-col items-start">
          <div class="flex items-center space-x-2 mb-1">
            <component :is="n.icon" :class="n.iconClass" class="w-4 h-4" />
            <span class="font-medium text-foreground">{{ n.title }}</span>
          </div>
          <p class="text-sm text-muted-foreground">{{ n.message }}</p>
          <span class="text-xs text-muted-foreground mt-1">{{ n.time }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>


    <!-- Profile Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar class="w-8 h-8 hover:bg-muted">
          <AvatarImage src="https://github.com/unovu.png" alt="@unovue" />
          <AvatarFallback>JA</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconUser class="mr-2 h-4 w-4" />Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconSettings class="mr-2 h-4 w-4" />Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconBarChart3 class="mr-2 h-4 w-4" />Analytics
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="signOut()">
          <IconLogOut class="mr-2 h-4 w-4" />Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { IconCalendar, IconBarChart3, IconTrendingUp } from "#components"

const { signOut } = useAuth()

const notificationCount = ref(3)

const notifications = [
  {
    icon: IconCalendar,
    iconClass: 'text-primary',
    title: 'Habit Reminder',
    message: 'Time for your daily reading session!',
    time: '2 minutes ago'
  },
  {
    icon: IconBarChart3,
    iconClass: 'text-success',
    title: 'Streak Achievement',
    message: 'Congratulations on your 7-day streak!',
    time: '1 hour ago'
  },
  {
    icon: IconTrendingUp,
    iconClass: 'text-warning',
    title: 'Weekly Summary',
    message: 'Your weekly progress report is ready',
    time: '3 hours ago'
  }
]

</script>

<style scoped></style>