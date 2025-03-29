<!-- Pet grid -->
<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 gap-4 w-[100%] my-10 pb-10 md:pb-0 md:pl-20"
  >
    <PetCard
      v-for="pet in pets"
      :id="pet._id"
      :name="pet.name"
      :breed="pet.breed"
      :distance="pet.distance"
      :status="pet.status"
      :description="pet.description"
      :category="pet.category"
      :petView="false"
      :image="pet.images?.[0] || 'https://placehold.co/600x400'"
    />
  </div>
  <div 
    v-if="dataFilter" 
    class="fixed bottom-20 right-4 z-50"
  >
    <!-- Botón de acción principal -->
    <button
      @click="clearFilter"
      :class="[
        `rounded-full w-14 h-14 flex items-center bg-white 
        justify-center text-purple-500 shadow-lg transition-transform duration-200`,
      ]"
      aria-label="Toggle action menu"
    >
      <X />
    </button>
  </div>
  <ArcMenu v-if="!dataFilter" />
  <BottomNavBar />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import PetCard from "../components/PetCard.vue";
import BottomNavBar from "../components/BottomNavBar.vue";
import Header from "../components/Header.vue";
import ArcMenu from "../components/ArcMenu.vue";
import {
  ArrowLeft,
  MoreVertical,
  MapPin,
  Home,
  MessageSquare,
  User,
  X
} from "lucide-vue-next";

const clearFilter = () => {
  window.localStorage.removeItem('dataFilter')
  window.location.reload()
};
const pets = ref([]);
const dataFilter = JSON.parse(localStorage.getItem("dataFilter"));
const fetchPets = async () => {
  try {
    const response = await fetch(`http://localhost:3000/pets/pets`, {
      // La ruta correcta es /pets
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    pets.value = data; // Llenar la constante pets con los datos obtenidos
    const dataFilter = JSON.parse(localStorage.getItem("dataFilter")) || {};
    console.log("DataFilter", dataFilter);
    if (dataFilter.length) {
      pets.value = dataFilter;
    }
  } catch (err) {
    console.error("Error", err.message);
  }
};

onMounted(() => {
  fetchPets();
});
</script>
