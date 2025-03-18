<template>
  <router-link :to="`/details?id=${id}`">
    <div
      class="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100"
    >
      <div class="relative">
        <img
          :src="image || '/placeholder.svg'"
          :alt="name"
          class="w-full h-32 object-cover"
        />
      </div>
      <div class="p-3 flex flex-col">
        <div class="flex justify-between items-start">
          <h3 class="font-medium text-gray-800">{{ name }}</h3>
          <div class="flex items-center text-xs text-purple-600">
            <MapPin class="h-3 w-3 mr-0.5" />
            <span>{{ distance }}</span>
          </div>
        </div>
        <div class="text-xs text-gray-500 mb-1.5 text-left">{{ breed }}</div>
        <div
          class="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded inline-block"
        >
          {{ status }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { defineProps } from "vue";
import { MapPin } from "lucide-vue-next";

const props = defineProps({
  id: [Number, String],
  name: String,
  breed: String,
  distance: String,
  status: String,
  image: String,
});
</script>
