<template>
  <div v-if="isPetCardVisible" class="fixed bottom-20 right-4 z-50">
    <!-- Botón de acción principal -->
    <button
      @click="handlePrimaryClick"
      :class="[
        `rounded-full w-14 h-14 flex items-center bg-white 
        justify-center text-purple-500 shadow-lg transition-transform duration-200`,
      ]"
      aria-label="Toggle action menu"
    >
      <Plus />
    </button>
  </div>

  <div
    v-if="isPetCardVisible"
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
      :petView="true"
      :image="'https://placehold.co/600x400'"
    />
  </div>

  <div
    v-if="!isPetCardVisible"
    class="flex justify-center items-center min-h-screen p-4"
  >
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl text-purple-600">{{ "New Pet" }}</CardTitle>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="name">Name</Label>
            </div>
            <Input id="name" v-model="formData.name" required />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="email">Breed</Label>
            </div>
            <Input id="breed" v-model="formData.breed" required />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="phoneNumber">Status</Label>
            </div>
            <Select v-model="formData.status" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="Adoption"> Adoption </SelectItem>
                  <SelectItem value="Mating"> Mating </SelectItem>
                  <SelectItem value="Search"> Search </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="phoneNumber">Description</Label>
            </div>
            <Input id="description" v-model="formData.description" required />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="phoneNumber">Category</Label>
            </div>
            <Select v-model="formData.category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Cat"> Cat </SelectItem>
                  <SelectItem value="Dog"> Dog </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <!-- <GoogleMap /> -->
        </CardContent>
        <CardFooter class="flex justify-end space-x-4">
          <Button
            class="w-full sm:w-auto text-purple-600 hover:text-purple-600"
            variant="outline"
            type="button"
            @click="redirectBack"
          >
            {{ "Back" }}
          </Button>
          <Button
            class="w-full sm:w-auto bg-purple-600 hover:bg-purple-400"
            type="submit"
            :disabled="isLoading"
          >
            {{ isLoading ? "Saving..." : "Save" }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
  <BottomNavBar />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Plus, Cat, Dog, Heart, Search, House } from "lucide-vue-next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { store } from "@/storage/user-store.ts";
import GoogleMap from "@/components/GoogleMap.vue";
import PetCard from "../components/PetCard.vue";
import BottomAddPet from "../components/BottomAddPet.vue";
import BottomNavBar from "../components/BottomNavBar.vue";
const user = JSON.parse(localStorage.getItem("user")) || {};
const formData = ref({
  name: "",
  breed: "",
  status: "",
  description: "",
  category: "",
  owner: user.id,
});

const pets = ref([]);

const isPetCardVisible = ref(true);
const route = useRoute();
const router = useRouter();

const error = ref("");
const isLoading = ref(false);

const redirectBack = () => {
  isPetCardVisible.value = true; // Ocultar el div de los PetCards
  fetchPets();
};

const handleSubmit = async () => {
  error.value = "";
  isLoading.value = true;
  try {
    console.log(formData.value);
    const response = await fetch(`http://localhost:3000/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData.value),
    });
    fetchPets();
    isPetCardVisible.value = true;
  } catch (err) {
    error.value = "Create failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

// Obtener las mascotas desde el backend
const fetchPets = async () => {
  isLoading.value = true;
  error.value = ""; // Limpiar cualquier error previo

  try {
    const response = await fetch(`http://localhost:3000/pets/byOwner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    console.log("Response", response);
    const data = await response.json();
    pets.value = data; // Llenar la constante pets con los datos obtenidos
    console.log("PetsValue", pets.value);
  } catch (err) {
    error.value = err.message; // Manejar cualquier error
  } finally {
    isLoading.value = false;
  }
};

const handlePrimaryClick = () => {
  isPetCardVisible.value = !isPetCardVisible.value;
  formData.value = {
    // Resetea formData a su estado inicial
    name: "",
    breed: "",
    status: "",
    description: "",
    category: "",
    owner: user.id,
  };
};

onMounted(() => {
  fetchPets();
  localStorage.setItem("petsView", true);
  localStorage.removeItem("dataFilter");
});
</script>
