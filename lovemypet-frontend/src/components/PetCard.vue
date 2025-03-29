<template>
  <div
    @click="handleClick(id)"
    v-if="
      isPetCardVisible &&
      (store.currentEditingPetId === null || id === store.currentEditingPetId)
    "
    class="rounded-lg overflow-hidden bg-white shadow-sm border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer"
  >
    <div class="relative">
      <img
        :src="image || '/placeholder.svg'"
        :alt="name"
        class="w-full h-32 object-cover"
      />
    </div>
    <div class="p-3 flex flex-col">
      <div class="flex justify-between items-center">
        <h3 class="font-medium text-gray-800">{{ name }}</h3>
      </div>
      <div class="text-xs text-gray-500 mb-1.5 text-left">{{ breed }}</div>
      <div class="text-xs text-gray-500 mb-1.5 text-left">{{ category }}</div>
      <div
        class="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded inline-block"
      >
        {{ status }}
      </div>
    </div>
  </div>

  <!-- Formulario de edición -->
  <div
    v-if="!isPetCardVisible"
    class="col-span-3 flex justify-center items-center p-4"
  >
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl text-purple-600">{{ "Edit Pet" }}</CardTitle>
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
              <Label for="description">Description</Label>
            </div>
            <Input id="description" v-model="formData.description" required />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="category">Category</Label>
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
</template>

<script setup>
import { ref, computed } from "vue"; // Asegúrate de importar ref
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { store } from "@/storage/user-store.ts";

const router = useRouter();
const isPetCardVisible = ref(true); // Variable para mostrar/ocultar el div de mascota
const error = ref("");
const isLoading = ref(false);
const petId = computed(() => props.id);

const formData = ref({
  id: "",
  name: "",
  breed: "",
  status: "",
  description: "",
  category: "",
});

const handleClick = (id) => {
  // Cambia el estado de visibilidad
  props.petView ? editPet(id) : goToDetails();
};

const editPet = (id) => {
  // Cambia el estado de visibilidad
  isPetCardVisible.value = false;
  store.currentEditingPetId = id;
  // Rellenar los datos del formulario con los valores actuales de la mascota
  formData.value = {
    name: props.name,
    breed: props.breed,
    status: props.status,
    description: props.description, // Aquí agregas los datos iniciales
    category: props.category, // Aquí agregas los datos iniciales
    id: props.id,
  };
  console.log("FormData", formData.value);
};

const handleSubmit = async () => {
  // Aquí manejas el proceso de guardar los cambios del formulario
  console.log("Formulario guardado:", formData.value);
  error.value = "";
  isLoading.value = true;
  try {
    console.log(formData.value);
    const response = await fetch(
      `http://localhost:3000/pets/${formData.value.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.value),
      }
    );
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
  store.currentEditingPetId = null;
};

const props = defineProps({
  id: String,
  name: String,
  description: String,
  category: String,
  breed: String,
  status: String,
  image: String,
  petView: Boolean,
});

console.log("Props", props);
</script>
