<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl">{{ isRegistering ? "Create an account" : "Profile data" }}</CardTitle>
        <CardDescription v-if="isRegistering">Enter your information to register</CardDescription>
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
          <div v-if="isRegistering" class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
            </div>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
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
          <!-- <GoogleMap /> -->
        </CardContent>
        <CardFooter class="flex flex-col space-y-4">
          <Button class="w-full" type="submit" :disabled="isLoading">
            {{
              isLoading
                ? isRegistering
                  ? "Creating account..."
                  : "Saving..."
                : isRegistering
                ? "Register"
                : "Save"
            }}
          </Button>
          <p
            v-if="isRegistering"
            class="text-sm text-center text-muted-foreground"
          >
            Already have an account?
            <Button variant="link" class="p-0 h-auto" type="button" @click="goToLogin"
              >Log in</Button
            >
          </p>
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
import GoogleMap from '@/components/GoogleMap.vue'

const formData = ref({
  name: store.user.name,
  email: store.user.email,
  password: "",
  phoneNumber: store.user.phoneNumber,
});

const route = useRoute();
const router = useRouter();
const isRegistering = computed(
  () => route.path === "/auth/register" && !store.user.name
);

const goToLogin = () => {
  router.push('/auth'); // Cambia '/login' por la ruta deseada
};

const error = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = "";
  isLoading.value = true;
  try {
    console.log(formData.value);

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData.value),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await response.json();
    console.log("Login successful:", data);
    router.push("/");
  } catch (err) {
    error.value = "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
