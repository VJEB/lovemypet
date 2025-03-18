<template>
  <div
    class="fixed bottom-0 left-0 w-[100%] bg-white border-t border-gray-200 flex justify-around items-center py-2"
  >
    <router-link to="/" class="flex flex-col items-center p-2">
      <Home
        :class="[
          'h-6 w-6',
          isActive('/') ? 'text-purple-500' : 'text-gray-400',
        ]"
      />
    </router-link>

    <router-link to="/posts" class="flex flex-col items-center p-2">
      <PawPrint
        :class="[
          'h-6 w-6',
          isActive('/posts') ? 'text-purple-500' : 'text-gray-400',
        ]"
      />
    </router-link>

    <router-link to="/profile" class="flex flex-col items-center p-2">
      <User
        :class="[
          'h-6 w-6',
          isActive('/profile') ? 'text-purple-500' : 'text-gray-400',
        ]"
      />
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { Home, MessageSquare, User, PawPrint } from "lucide-vue-next";
const route = useRoute();

// Simple function to check if the current route matches the provided path
const isActive = (path) => {
  // For '/category', check if the route contains the string
  if (path === "/category") {
    return route.path.includes(path);
  }
  return route.path === path;
};
</script>
