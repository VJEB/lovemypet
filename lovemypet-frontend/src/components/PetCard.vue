<template>
  <div v-if="isPetCardVisible" class="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
    <div class="relative">
      <img :src="image || '/placeholder.svg'" :alt="name" class="w-full h-32 object-cover" />
    </div>
    <div class="p-3 flex flex-col">
      <div class="flex justify-between items-center">
        <h3 class="font-medium text-gray-800">{{ name }}</h3>
        <div class="flex space-x-2">
          <button v-if="petView"
            class="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 focus:outline-none"
            @click="editPet">
            Edit
          </button>
          <button @click="goToDetails"
           class="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 focus:outline-none">
            Detail
          </button>
        </div>
      </div>
      <div class="text-xs text-gray-500 mb-1.5 text-left">{{ breed }}</div>
      <div class="text-xs text-gray-500 mb-1.5 text-left">{{ category }}</div>
      <div class="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded inline-block">
        {{ status }}
      </div>
    </div>
  </div>

  <!-- Formulario de edición -->
  <div v-if="!isPetCardVisible" class="flex justify-center items-center min-h-screen p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl">{{ "Edit Pet" }}</CardTitle>
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
              <Label for="breed">Breed</Label>
            </div>
            <Input id="breed" v-model="formData.breed" required />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="status">Status</Label>
            </div>
            <Input id="status" v-model="formData.status" placeholder="(Adoption, Mating or Search)" required />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="description">Description</Label>
            </div>
            <Input id="description" v-model="formData.description" required />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="category">Category</Label>
            </div>
            <Input id="category" v-model="formData.category" placeholder="Cat or Dog" required />
          </div>
        </CardContent>
        <CardFooter class="flex justify-end space-x-4">
          <Button class="w-full sm:w-auto" type="button" @click="redirectBack">
            {{ "Back" }}
          </Button>
          <Button class="w-full sm:w-auto" type="submit" :disabled="isLoading">
            {{ isLoading ? "Saving..." : "Save" }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed  } from 'vue';  // Asegúrate de importar ref
import { MapPin } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "vue-router";

const router = useRouter();
const isPetCardVisible = ref(true); // Variable para mostrar/ocultar el div de mascota
const error = ref("");
const isLoading = ref(false);
const petId = computed(() => props.id);

const formData = ref({
  id: '',
  name: '',
  breed: '',
  status: '',
  description: '',
  category: ''
});

const editPet = () => {
  // Cambia el estado de visibilidad
  isPetCardVisible.value = false;

  // Rellenar los datos del formulario con los valores actuales de la mascota
  formData.value = {
    name: props.name,
    breed: props.breed,
    status: props.status,
    description: props.description, // Aquí agregas los datos iniciales
    category: props.category, // Aquí agregas los datos iniciales
    id: props.id
  };
  console.log('FormData', formData.value)
};

const handleSubmit = async () => {
  // Aquí manejas el proceso de guardar los cambios del formulario
  console.log("Formulario guardado:", formData.value);
  error.value = "";
  isLoading.value = true;
  try {
    console.log(formData.value);
    const response = await fetch(`http://localhost:3000/pets/${formData.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData.value),
    });
    isPetCardVisible.value = true;
    window.location.reload();
  } catch (err) {
    error.value = "Update failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const goToDetails = () => {
  if (petId.value) {
    router.push({ path: `/details/${petId.value}` });
  } else {
    console.error("El ID de la mascota no está definido.");
  }
};
const redirectBack = () => {
  // Aquí manejas el comportamiento del botón "Back"
  isPetCardVisible.value = true;
};

const props = defineProps({
  id: String,
  name: String,
  description: String,
  category: String,
  breed: String,
  status: String,
  image: String,
  petView: Boolean
});

console.log('Props', props);
</script>
