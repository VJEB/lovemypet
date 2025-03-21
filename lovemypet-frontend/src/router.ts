import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./pages/MainScreen.vue";
import DetailView from "./pages/PetDetail.vue";
import LoginView from "./pages/Login.vue";
import RegisterView from "./pages/Register.vue";
import ProfileFormView from "./pages/ProfileForm.vue";
import ProfileView from "./pages/Profile.vue";
import PetFormView from "./pages/PetForm.vue";

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

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
    path: "/details/:id",
    component: DetailView,
  },
  {
    path: "/posts",
    component: PetFormView,
    props: true
  },
  {
    path: "/profile",
    component: ProfileView,
  },
  {
    path: "/profile/form",
    component: ProfileFormView,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    // If the user is trying to access a protected route and is not authenticated
    if (to.path === "/auth" || to.path === "/auth/register") {
        next(); // Allow navigation
        return;
    }
    if (!isAuthenticated()) {
        next("/auth");
        return;
    }
    next();
});