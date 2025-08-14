import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Define all routes
const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login.vue"),
    meta: {
      public: true, // Accessible without authentication
      title: "Login | SiteHub",
    },
  },
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/layouts/DashboardLayout.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard | SiteHub",
    },
    children: [
      {
        path: "/clients",
        name: "clients",
        component: () => import("@/pages/ClientsPage.vue"),
        meta: {
          title: "Clients | SiteHub",
          breadcrumb: "Clients",
        },
      },
      {
        path: "/websites",
        name: "websites",
        component: () => import("@/pages/WebsitesPage.vue"),
        meta: {
          title: "Websites | SiteHub",
          breadcrumb: "Websites",
        },
      },
      {
        path: "", // Default child route
        redirect: "/clients",
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*", // Catch-all 404 route
    name: "not-found",
    redirect: "/", // Redirect to dashboard (or create a 404 page)
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return to saved position or top of page
    return savedPosition || { top: 0 };
  },
});

// Navigation guard for authentication and page titles
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Set page title if available
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login with return URL
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
  // Prevent authenticated users from accessing login page
  else if (to.name === "login" && authStore.isAuthenticated) {
    next("/"); // Redirect to dashboard
  }
  // Continue navigation
  else {
    next();
  }
});

export default router;
