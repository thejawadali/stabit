<template>
  <Sidebar class="w-56 transition-all duration-300 border-r border-border t-16" collapsible="icon">
    <SidebarHeader>
      <NuxtLink to="/" class="flex items-center space-x-2 px-2 py-4">
        <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <IconTrendingUp class="w-5 h-5 text-primary-foreground" />
        </div>
        <span class="text-2xl font-bold text-foreground">Stabit</span>
      </NuxtLink>
    </SidebarHeader>
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
  IconUser,
  IconAward,
  IconTags
} from "#components"

const route = useRoute()

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconHome,
  },
  { title: "My Habits", url: "/habits", icon: IconTarget },
  { title: "Categories", url: "/categories", icon: IconTags },
  // { title: "Analytics", url: "/analytics", icon: IconBarChart3 },
  // { title: "Calendar", url: "/calendar", icon: IconCalendar },
  // { title: "Progress", url: "/progress", icon: IconTrendingUp },
  { title: "Milestones", url: "/milestones", icon: IconAward },
  { title: "Settings", url: "/settings", icon: IconSettings },
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