<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl">Login</CardTitle>
        <CardDescription
          >Enter your credentials to access your account</CardDescription
        >
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent class="space-y-4">
          <Alert v-if="error" variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="email" class="text-left">Email</Label>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              v-model="email"
              required
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password" class="text-left">Password</Label>
            </div>
            <Input id="password" type="password" v-model="password" required />
          </div>
          <div class="text-sm text-center">
            Don't have an account? 
            <a href="/auth/register" class="text-blue-600 hover:underline">
              Create Account
            </a>
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full" type="submit" :disabled="isLoading">
            {{ isLoading ? "Logging in..." : "Log in" }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-vue-next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { store } from "@/storage/user-store.ts"

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await response.json();
    console.log(data);    
    localStorage.setItem('token', data.token)
    store.setUser(data.user)

    // Handle successful login (e.g., save token, redirect, etc.)
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>
