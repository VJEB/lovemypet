<template>
  <div class="max-w-md mx-auto bg-white min-h-screen relative pb-36">
    <!-- Header -->
    <Header />

    <div class="shadow-lg p-4 mt-6 rounded-md">
      <div class="rounded-lg overflow-hidden my-3">
        <img
          :src="petData?.images[0] || 'https://placehold.co/600x400'"
          alt="Remo the bird"
          class="w-full h-64 object-cover"
        />
      </div>

      <!-- Thumbnails -->
      <!-- <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
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
      </div> -->
      <!-- Pet name and location -->
      <div class="flex justify-between items-start mb-1">
        <h2 class="text-2xl font-semibold text-gray-800">{{ pet.name }}</h2>
        <div class="flex items-center text-sm text-purple-600">
          <MapPin class="h-4 w-4 mr-1" />
          <span>{{ isNaN(formData.distance) ? 0 : formData.distance }}</span>
        </div>
      </div>

      <!-- Breed and adoption tag -->
      <div class="flex items-start gap-2 mb-4 flex-col">
        <span class="text-black text-xl">{{ formData.name }}</span>
        <span class="text-gray-500">{{ formData.breed }}</span>
        <span
          class="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded"
          >{{ formData.status }}</span
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
  </div>

  <!-- Bottom action buttons -->
  <div
    class="fixed bottom-4 left-0 right-0 p-4 bg-white flex gap-3 max-w-md mx-auto"
  >
    <div
      class="flex-grow bg-gray-50 p-3 rounded-lg flex items-center justify-between mb-6 shadow-lg mt-4"
    >
      <div class="flex items-center gap-3">
        <img
          :src="userData?.profilePicture || 'https://placehold.co/600x400'"
          alt="Pet owner"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div class="text-xs text-gray-500 text-left">Pet Owner</div>
          <div class="font-medium">{{ formData.user }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500 text-left">Phone Number</div>
          <div class="font-medium">{{ formData.phoneNumber }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, computed } from "vue";
import {
  ArrowLeft,
  MoreVertical,
  MapPin,
  Phone,
  MessageSquare,
  Heart,
  UserCircle,
} from "lucide-vue-next";
import Header from "../components/Header.vue";
import { useRoute } from "vue-router";

const petData = ref(null);
const userData = ref(null);
const userLocation = ref(null);
const distance = ref(null);
const route = useRoute();
const formData = ref({
  name: "",
  breed: "",
  status: "",
  description: "",
  category: "",
  user: "",
  phoneNumber: "",
  distance: 0,
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  console.log("Calculando distancia entre:", lat1, lon1, lat2, lon2);

  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371; // Radio de la Tierra en km

  // Convertimos a radianes
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2); // Redondeamos a 2 decimales
};

onMounted(async () => {
  const petId = route.params.id;

  // Obtener usuario logueado desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  userLocation.value = user.location; // Suponiendo que contiene { lat, lng }

  // Obtener datos de la mascota
  const response = await fetch(`http://localhost:3000/pets/${petId}`);
  petData.value = await response.json();

  // Obtener datos del dueño de la mascota
  const userResponse = await fetch(
    `http://localhost:3000/users/${petData.value.owner}`
  );
  userData.value = await userResponse.json();

  // Asignar datos al formulario
  formData.value = {
    name: petData.value.name,
    breed: petData.value.breed,
    status: petData.value.status,
    description: petData.value.description,
    category: petData.value.category,
    user: userData.value.name,
    phoneNumber: userData.value.phoneNumber,
  };

  console.log("UserLocation", userLocation.value);
  console.log("UserLocationOwner", userData.value.location);

  // Verificar que ambas ubicaciones existen antes de calcular la distancia
  if (userLocation.value && userData.value.location) {
    formData.value.distance = calculateDistance(
      userLocation.value.coordinates[0],
      userLocation.value.coordinates[1],
      userData.value.location.coordinates[0],
      userData.value.location.coordinates[1]
    );
  }
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
