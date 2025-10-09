<template>
  <TooltipProvider :delay-duration="0">
    <Sidebar :class="[
      collapsed ? 'w-14' : 'w-56',
      'transition-all duration-300 bg-red-800 border-r border-border mt-[64px]'
    ]" collapsible="icon">
      <SidebarContent :class="collapsed ? 'px-1' : 'px-2'">
        <!-- Main Navigation -->
        <SidebarGroup :class="collapsed ? 'py-2' : ''">
          <SidebarGroupLabel v-if="!collapsed"
            class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main
          </SidebarGroupLabel>
          <div v-if="collapsed" class="h-px bg-border my-2 mx-2" />
          <SidebarGroupContent>
            <SidebarMenu :class="collapsed ? 'space-y-1' : ''">
              <SidebarMenuItem v-for="item in navigationItems" :key="item.title">
                <SidebarMenuButton asChild :class="collapsed ? 'h-10 w-10 p-0 mx-auto' : ''">
                  <component :is="collapsed ? 'Tooltip' : 'div'" v-if="collapsed">
                    <TooltipTrigger asChild>
                      <NuxtLink :to="item.url" :class="getNavClasses(item.url)">
                        <component :is="item.icon" class="h-5 w-5" />
                        <Badge v-if="item.badge" :variant="item.badge.variant || 'secondary'" class="ml-auto text-xs">
                          {{ item.badge.text }}
                        </Badge>
                      </NuxtLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" class="font-medium">
                      <p>{{ item.title }}</p>
                      <p v-if="item.badge" class="text-xs text-muted-foreground mt-1">
                        {{ item.badge.text }} {{ item.badge.variant === 'destructive' ? 'new' : 'items' }}
                      </p>
                    </TooltipContent>
                  </component>
                  <NuxtLink v-else :to="item.url" :class="getNavClasses(item.url)">
                    <component :is="item.icon" class="h-4 w-4" />
                    <span>{{ item.title }}</span>
                    <Badge v-if="item.badge" :variant="item.badge.variant || 'secondary'" class="ml-auto text-xs">
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
  </TooltipProvider>
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

const { state } = useSidebar()
const route = useRoute()
const collapsed = computed(() => state.value === "collapsed")

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

const communityItems = [
  {
    title: "Challenges",
    url: "/challenges",
    icon: IconTrophy,
    badge: { text: "2", variant: "destructive" }
  },
  { title: "Community", url: "/community", icon: IconUsers },
  { title: "Resources", url: "/resources", icon: IconBookOpen },
]

const settingsItems = [
  { title: "Notifications", url: "/notifications", icon: IconBell },
  { title: "Profile", url: "/profile", icon: IconUser },
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