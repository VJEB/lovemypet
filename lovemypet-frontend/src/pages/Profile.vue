<template>
  <div class="max-w-md mx-auto bg-white min-h-screen relative pb-16">
    <!-- Header -->
    <header class="flex items-center justify-between p-4">
      <div></div>
      <h1 class="text-lg font-medium text-gray-800">Profile</h1>
      <div></div>
    </header>

    <!-- Profile Info -->
    <div class="px-4">
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-3">
          <img src="https://placehold.co/100x100" alt="Profile picture"
            class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
          <button class="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full shadow-sm">
            <Edit class="h-4 w-4" />
          </button>
        </div>
        <h2 class="text-xl font-bold">{{ user.name }}</h2>
      </div>

      <!-- Contact Information -->
      <div class="bg-gray-50 rounded-xl p-4 mb-4 text-left">
        <h3 class="font-bold mb-3">Contact Information</h3>

        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500">Email</p>
            <p class="font-medium">{{ user.email }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Phone Number</p>
            <p class="font-medium">{{ user.phoneNumber }}</p>
          </div>
          
          <!-- Google Map with user's location -->
          <div>
            <p class="font-medium">Location</p>
            <div style="margin-top: 1rem;">
              <GoogleMapProfile :initialLocation="user.location" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="rounded-xl border border-gray-100 overflow-hidden mb-4">
      <div class="divide-y">
        <router-link to="/profile/form" class="flex items-center justify-between p-2 hover:bg-gray-50">
          <div class="flex items-center">
            <div class="bg-purple-100 p-2 rounded-full mr-3">
              <Pencil class="h-5 w-5 text-purple-600" />
            </div>
            <span>Edit profile info</span>
          </div>
          <ChevronRight class="h-5 w-5 text-gray-400" />
        </router-link>
        <router-link to="/auth" class="flex items-center justify-between p-2 hover:bg-gray-50"
          @click.prevent="logout">
          <div class="flex items-center">
            <div class="bg-red-100 p-2 rounded-full mr-3">
              <LogOut class="h-5 w-5 text-red-600" />
            </div>
            <span>Log Out</span>
          </div>
          <ChevronRight class="h-5 w-5 text-gray-400" />
        </router-link>
      </div>
    </div>

    <!-- Delete Account -->
    <div class="mb-8">
      <button @click="deleteAccount()"
        class="w-full flex items-center justify-center gap-2 p-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50">
        <Trash2 class="h-5 w-5" />
        <span class="font-medium">Delete Account</span>
      </button>
    </div>
  </div>

  <!-- Bottom navigation -->
  <BottomNavBar />
</template>

<script setup>
import { ref, onMounted } from "vue";
import GoogleMap from '@/components/GoogleMap.vue'
import { store } from "@/storage/user-store.ts"
import { useRouter } from "vue-router";
import GoogleMapProfile from "@/components/GoogleMapProfile.vue";
import BottomNavBar from "../components/BottomNavBar.vue";

// Definir variables reactivas
const error = ref("");
const isLoading = ref(false);
const user = JSON.parse(localStorage.getItem('user')); // Obtener los datos del usuario desde localStorage
const router = useRouter();
// console.log('UseRdATA', user.location.coordinates[0])

// Función para eliminar la cuenta
const deleteAccount = async () => {
  error.value = "";
  isLoading.value = true;
  const user = JSON.parse(localStorage.getItem('user')) || {};
  try {
    const response = await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Couldn't delete account");
    }

    const data = await response.json();
    console.log("Account deleted succesfully:", data);
    router.push("/auth");
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  store.setUser(null); // Ajusta según tu store
  router.push("/auth");
};

</script>
