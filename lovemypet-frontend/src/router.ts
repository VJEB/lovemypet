import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./pages/MainScreen.vue";
import DetailView from "./pages/PetDetail.vue";
import LoginView from "./pages/Login.vue";
import RegisterView from "./pages/Register.vue";
import ProfileView from "./pages/Profile.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/auth",
    component: LoginView,
  },
  {
    path: "/auth/register",
    component: RegisterView,
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
    component: ProfileView,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
