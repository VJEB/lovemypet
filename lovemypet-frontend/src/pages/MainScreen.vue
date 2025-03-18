<!-- Pet grid -->
<template>
  <Header />
  <div class="grid grid-cols-2 gap-4 w-[100%] my-10">
    <PetCard
      v-for="pet in pets"
      :id="pet.id"
      :name="pet.name"
      :breed="pet.breed"
      :distance="pet.distance"
      :status="pet.status"
      :image="pet.image"
    />
  </div>
  <ArcMenu />
  <BottomNavBar />
</template>

<script setup>
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
} from "lucide-vue-next";

const pets = [
  // Same pets array as in React version
  {
    id: 1,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  {
    id: 2,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  {
    id: 3,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  {
    id: 4,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  {
    id: 5,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  {
    id: 6,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  {
    id: 7,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  {
    id: 8,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  {
    id: 9,
    name: "Blue Ice",
    breed: "Chinchilla",
    distance: "1.8km",
    status: "ADOPTION",
    statusColor: "bg-purple-100 text-purple-600",
    image: "https://placehold.co/600x400",
  },
  // ... rest of the pet objects
];

const categories = [
  { id: "adoption", name: "Adoption", active: false },
  { id: "disappear", name: "Disappear", active: false },
  { id: "mating", name: "Mating", active: false },
];
</script>
