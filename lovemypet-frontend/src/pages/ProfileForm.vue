<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl">{{ "Edit Profile" }}</CardTitle>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent class="space-y-4">
          <Alert v-if="error" variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="name">Name</Label>
            </div>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="John Doe"
              required
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="email">Email</Label>
            </div>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="johndoe@gmail.com"
              required
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="phoneNumber">Phone Number</Label>
            </div>
            <Input
              id="phoneNumber"
              v-model="formData.phoneNumber"
              type="tel"
              placeholder="55555555"
              required
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="phoneNumber">Location</Label>
            </div>
          </div>
          <GoogleMapProfile
            @updateLocation="(location) => (formData.location = location)"
          />
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="image">Profile Picture</Label>
            </div>
            <input
              id="image"
              type="file"
              name="image"
              @change="handleImageUpload"
              accept="image/*"
              class="w-full"
            />
          </div>
          <!-- <GoogleMap /> -->
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
import { ref, computed } from "vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { store } from "@/storage/user-store.ts";
import GoogleMapProfile from "@/components/GoogleMapProfile.vue";
import Header from "../components/Header.vue";

const props = defineProps({
  location: {
    type: Object,
    default: null,
  },
});

const user = JSON.parse(localStorage.getItem("user")) || {};
const formData = ref({
  id: user.id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  location: user.location,
});

const route = useRoute();
const router = useRouter();

const error = ref("");
const isLoading = ref(false);

const redirectBack = () => {
  router.push("/profile"); // Cambia '/login' por la ruta deseada
};
const selectedFile = ref(null);

const handleImageUpload = (e) => {
  selectedFile.value = e.target.files[0];
};
const handleSubmit = async () => {
  error.value = "";
  isLoading.value = true;
  try {
    console.log("Value", formData.value);
    // Ensure the location object is in the correct format
    const location = {
      type: formData.value.location.type || "Point", // Default to 'Point' if type is undefined
      coordinates: formData.value.location.coordinates, // Coordinates are always present
    };
    formData.value.location = location; // Update location in formData

    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.value.id);
    formDataToSend.append("name", formData.value.name);
    formDataToSend.append("email", formData.value.email);
    formDataToSend.append("phoneNumber", formData.value.phoneNumber);
    formDataToSend.append("location", JSON.stringify(formData.value.location));
    if (selectedFile.value) {
      formDataToSend.append("image", selectedFile.value);
    }
    const response = await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PUT",
      body: formDataToSend,
    });
    console.log("Value 2");
    localStorage.removeItem("user");
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...formData.value,
        profilePicture: (await response.json())._doc.profilePicture,
      })
    );
    router.push("/profile");
  } catch (err) {
    console.log(err);

    error.value = "Update failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
