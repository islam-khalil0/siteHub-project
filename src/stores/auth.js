import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const isAuthenticated = computed(() => !!user.value);

  // Hardcoded credentials
  const validCredentials = {
    email: "adpulseadmin2025@gmail.com",
    password: "admin#adpulse@2025",
  };

  function login(email, password) {
    if (email === validCredentials.email && password === validCredentials.password) {
      user.value = {
        email: validCredentials.email,
        name: "Admin",
      };
      localStorage.setItem("user", JSON.stringify(user.value));
      return true;
    }
    return false;
  }

  function logout() {
    user.value = null;
    localStorage.removeItem("user");
  }

  return { user, isAuthenticated, login, logout };
});
