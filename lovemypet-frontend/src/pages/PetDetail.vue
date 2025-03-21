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
      <!-- Breed and adoption tag -->
      <div class="flex items-start gap-2 mb-4 flex-col">
        <span class="text-black text-xl">{{ formData.name }}</span>
        <span class="text-gray-500">{{ formData.breed }}</span>
        <span class="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded"
          >{{formData.status}}</span
        >
      </div>

      <!-- Description -->
      <div class="mb-6">
        <h3 class="font-medium text-gray-800 mb-1 text-left">Description</h3>
        <p class="text-gray-500 text-sm text-left">
          {{ formData.description }}
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
      {{ formData.status }}
    </button>
    <!-- <button
      class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center"
    >
      <Heart class="h-6 w-6 text-gray-400" />
    </button> -->
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted   } from "vue";
import {
  ArrowLeft,
  MoreVertical,
  MapPin,
  Phone,
  MessageSquare,
  Heart,
} from "lucide-vue-next";
import Header from "../components/Header.vue";
import { useRoute } from "vue-router";

const mainImage = ref("https://placehold.co/600x400");
const petData = ref(null);
const route = useRoute();
console.log("ID recibido:", route.params.id);
const formData = ref({
    name: "",
    breed: "",
    status: "",
    description: "",
    category: "",
});

onMounted(async () => {
  const petId = route.params.id;
  const response = await fetch(`http://localhost:3000/pets/${petId}`);
  petData.value = await response.json();
  formData.value = {       // Resetea formData a su estado inicial
    name: petData.value.name,
    breed: petData.value.breed,
    status: petData.value.status,
    description: petData.value.description,
    category: petData.value.category,
  };
  console.log('PetData', petData.value)
});

const props = defineProps({
  pet: {
    default: () => ({
      images: [
        "https://placehold.co/600x400",
        "https://placehold.co/600x400",
        "https://placehold.co/600x400",
        "https://placehold.co/600x400",
        "https://placehold.co/600x400",
      ],
    }),
  },
});
</script>

<!-- <style scoped></style> -->
