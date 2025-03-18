import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./pages/MainScreen.vue";
import DetailView from "./pages/PetDetail.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/details",
    component: DetailView,
  },
  {
    path: "/posts",
    component: DetailView,
  },
  {
    path: "/profile",
    component: DetailView,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
