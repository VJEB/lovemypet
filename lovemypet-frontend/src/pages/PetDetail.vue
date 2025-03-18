<template>
  <div class="max-w-md mx-auto bg-white min-h-screen relative">
    <!-- Header -->
    <Header />

    <div class="shadow-lg p-4 mt-6 rounded-md">
      <div class="rounded-lg overflow-hidden my-3">
        <img
          :src="pet.images[0]"
          alt="Remo the bird"
          class="w-full h-64 object-cover"
        />
      </div>

      <!-- Thumbnails -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
        <div
          v-for="url in pet.images"
          :key="url"
          class="flex-shrink-0 rounded-lg overflow-hidden border border-gray-200"
        >
          <img
            :src="url"
            :alt="`Pet thumbnail ${url}`"
            class="w-[60px] h-[60px] object-cover"
          />
        </div>
      </div>

      <!-- Pet name and location -->
      <div class="flex justify-between items-start mb-1">
        <h2 class="text-2xl font-semibold text-gray-800">{{ pet.name }}</h2>
        <div class="flex items-center text-sm text-purple-600">
          <MapPin class="h-4 w-4 mr-1" />
          <span>1.8km</span>
        </div>
      </div>

      <!-- Breed and adoption tag -->
      <div class="flex items-start gap-2 mb-4 flex-col">
        <span class="text-gray-500">{{ pet.breed }}</span>
        <span class="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded"
          >ADOPTION</span
        >
      </div>

      <!-- Description -->
      <div class="mb-6">
        <h3 class="font-medium text-gray-800 mb-1 text-left">Description</h3>
        <p class="text-gray-500 text-sm text-left">
          {{ pet.description }}
          <router-link to="#" class="text-purple-600">
            Read More...</router-link
          >
        </p>
      </div>
    </div>
    <div
      class="bg-gray-50 p-3 rounded-lg flex items-center justify-between mb-6 shadow-lg mt-4"
    >
      <div class="flex items-center gap-3">
        <img
          src="https://placehold.co/600x400"
          alt="Pet owner"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div class="text-xs text-gray-500 text-left">Pet Owner</div>
          <div class="font-medium">{{ pet.owner.name }}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
        >
          <Phone class="h-4 w-4 text-purple-600" />
        </button>
        <button
          class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
        >
          <MessageSquare class="h-4 w-4 text-purple-600" />
        </button>
      </div>
    </div>
  </div>

  <!-- Bottom action buttons -->
  <div
    class="fixed bottom-4 left-0 right-0 p-4 bg-white flex gap-3 max-w-md mx-auto"
  >
    <button
      class="bg-purple-600 text-white rounded-full py-3 px-6 flex-1 font-medium"
    >
      {{ pet.status }}
    </button>
    <button
      class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
    >
      <Heart class="h-6 w-6 text-gray-400" />
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  ArrowLeft,
  MoreVertical,
  MapPin,
  Phone,
  MessageSquare,
  Heart,
} from "lucide-vue-next";
import Header from "../components/Header.vue";

const mainImage = ref("https://placehold.co/600x400");
const props = defineProps({
  pet: {
    type: {
      id: String,
      name: String,
      breed: String,
      distance: String,
      status: String,
      images: [String],
      description: String,
      owner: {
        type: {
          profilePicture: String,
          name: String,
          phoneNumber: String,
          email: String,
        },
      },
    },
    default: () => ({
      name: "Remo",
      description: `Sed volutpat tortor est, id molestie justo venenatis cat ut. Aliquam
                sollicitudin non risus eu viverra. Sed velit sed volutpat tortor est,
                id molestie justo venenatis cat ut.`,
      breed: "Russian Blue",
      status: "ADOPTION",
      images: [
        "https://placehold.co/600x400",
        "https://placehold.co/600x400",
        "https://placehold.co/600x400",
        "https://placehold.co/600x400",
        "https://placehold.co/600x400",
      ],
      owner: {
        name: "Kristin Watson",
      },
    }),
  },
});
</script>

<!-- <style scoped></style> -->
