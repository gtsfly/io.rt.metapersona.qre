import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "@/views/LoginForm.vue";
import RegisterForm from "@/views/RegisterForm.vue";
import RatingPage from "@/views/RatingPage.vue";
import HomePage from "@/views/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },

  {
    path: "/login",
    name: "login",
    component: LoginForm,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterForm,
  },
  { path: "/rating", name: "rating", component: RatingPage },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("username");

  if (
    !isLoggedIn &&
    to.name !== "login" &&
    to.name !== "register" &&
    to.name !== "Home"
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
