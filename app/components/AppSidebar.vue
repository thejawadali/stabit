<template>
  <Sidebar class="w-56 transition-all duration-300 bg-red-800 border-r border-border mt-16" collapsible="icon">
    <SidebarContent class="px-2">
      <!-- Main Navigation -->
      <SidebarGroup>
        <SidebarGroupLabel class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Main
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navigationItems" :key="item.title">
              <SidebarMenuButton asChild>
                <NuxtLink :to="item.url" :class="getNavClasses(item.url)">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                  <Badge v-if="item.badge" :variant="(item.badge.variant as any) || 'secondary'"
                    class="ml-auto text-xs">
                    {{ item.badge.text }}
                  </Badge>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>


<script setup lang="ts">
import {
  IconCalendar,
  IconHome,
  IconSettings,
  IconBarChart3,
  IconTrendingUp,
  IconTarget,
  IconTrophy,
  IconUsers,
  IconBookOpen,
  IconBell,
  IconUser
} from "#components"

const route = useRoute()

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconHome,
    badge: { text: "5", variant: "secondary" }
  },
  { title: "My Habits", url: "/habits", icon: IconTarget },
  { title: "Analytics", url: "/analytics", icon: IconBarChart3 },
  { title: "Calendar", url: "/calendar", icon: IconCalendar },
  { title: "Progress", url: "/progress", icon: IconTrendingUp },
]

const isActive = (path: string) => route.path === path

const getNavClasses = (path: string) => {
  const isActiveRoute = isActive(path)
  const baseClasses = "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors"
  const activeClasses = "bg-primary/10 text-primary font-medium border-primary"
  const inactiveClasses = "hover:bg-accent/50"

  return `${baseClasses} ${isActiveRoute ? activeClasses : inactiveClasses}`
}
</script>