<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-brand">
          <img src="@/assets/logo.png" alt="Logo" class="navbar-logo" />
        </router-link>
        <button class="navbar-toggler" @click="toggleNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div :class="['navbar-menu', { 'is-active': isNavbarActive }]">
          <div class="navbar-start">
            <router-link to="/" class="navbar-item">Ana Sayfa</router-link>
            <router-link v-if="isLoggedIn" to="/rating" class="navbar-item"
              >Değerlendirme</router-link
            >
          </div>
          <div class="navbar-end">
            <div v-if="isLoggedIn" class="navbar-item">
              <span class="user-greeting">Merhaba, {{ username }}</span>
            </div>
            <div v-if="isLoggedIn" class="navbar-item">
              <button @click="logout" class="logout-button">Çıkış Yap</button>
            </div>
            <div v-else class="navbar-item">
              <router-link to="/login" class="login-button"
                >Giriş Yap</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
      username: "",
      isNavbarActive: false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.username = "";
      this.$router.push("/");
    },
    toggleNavbar() {
      this.isNavbarActive = !this.isNavbarActive;
    },
    checkLoginStatus() {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        this.isLoggedIn = true;
        this.username = storedUsername;
      } else {
        this.isLoggedIn = false;
        this.username = "";
      }
    },
  },
  mounted() {
    this.checkLoginStatus();
  },
  watch: {
    $route() {
      this.checkLoginStatus();
    },
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: "Arial", sans-serif;
}

.navbar {
  background-color: #2c3e50;
  padding: 1rem;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-logo {
  height: 40px;
  margin-right: 1rem;
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.navbar-start,
.navbar-end {
  display: flex;
  align-items: center;
}

.navbar-item {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.navbar-item:hover {
  color: #3498db;
}

.user-greeting {
  color: #ecf0f1;
  margin-right: 1rem;
}

.logout-button,
.login-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  font-size: 0.9rem;
}

.logout-button:hover,
.login-button:hover {
  background-color: #c0392b;
}

.login-button {
  background-color: #3498db;
}

.login-button:hover {
  background-color: #2980b9;
}

.navbar-toggler {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.navbar-toggler-icon {
  display: block;
  width: 30px;
  height: 3px;
  background-color: #ecf0f1;
  position: relative;
  transition: background-color 0.3s ease;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #ecf0f1;
  transition: all 0.3s ease;
}

.navbar-toggler-icon::before {
  top: -8px;
}

.navbar-toggler-icon::after {
  bottom: -8px;
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #2c3e50;
    padding: 1rem;
  }

  .navbar-menu.is-active {
    display: flex;
  }

  .navbar-start,
  .navbar-end {
    flex-direction: column;
    width: 100%;
  }

  .navbar-item {
    padding: 0.5rem 0;
  }

  .navbar-toggler {
    display: block;
  }
}
</style>
