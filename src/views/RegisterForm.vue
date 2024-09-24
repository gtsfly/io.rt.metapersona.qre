<template>
  <div class="background-image"></div>
  <div class="register-page">
    <div class="form-container">
      <h2 class="form-title">Kayıt Ol</h2>
      <p class="form-subtitle">Otel deneyimlerinizi paylaşmaya başlayın</p>
      <form @submit.prevent="register" class="register-form">
        <div class="form-group">
          <label for="username" class="form-label">Kullanıcı Adı</label>
          <div class="input-with-icon">
            <i class="fas fa-user"></i>
            <input
              type="text"
              id="username"
              v-model="username"
              required
              placeholder="Kullanıcı adınız"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="email" class="form-label">E-posta</label>
          <div class="input-with-icon">
            <i class="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="E-posta adresiniz"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Şifre</label>
          <div class="input-with-icon">
            <i class="fas fa-lock"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Şifreniz"
            />
            <i
              :class="[
                'fas',
                showPassword ? 'fa-eye-slash' : 'fa-eye',
                'password-toggle',
              ]"
              @click="togglePasswordVisibility"
            ></i>
          </div>
        </div>
        <button type="submit" class="submit-button" :disabled="isLoading">
          <i
            class="fas"
            :class="isLoading ? 'fa-spinner fa-spin' : 'fa-user-plus'"
          ></i>
          {{ isLoading ? "Kaydediliyor..." : "Kayıt Ol" }}
        </button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="login-link">
        Zaten hesabınız var mı?
        <router-link to="/login">Giriş Yap</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { register } from "@/services/authService";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      showPassword: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async register() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        await register(this.username, this.email, this.password);
        this.$router.push({ name: "login", query: { email: this.email } });
      } catch (error) {
        console.error("Kayıt hatası:", error);
        this.errorMessage =
          "Kayıt yapılamadı. Lütfen bilgilerinizi kontrol edin.";
      } finally {
        this.isLoading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("@/assets/loginbackground.jpg") no-repeat center center;
  background-size: cover;
  z-index: -1;
  filter: blur(8px);
}

.form-container {
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.form-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
}

.input-with-icon input {
  padding-left: 35px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  cursor: pointer;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #425071;
  outline: none;
}

.submit-button {
  width: 100%;
  background-color: #425071;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button i {
  margin-right: 0.5rem;
}

.submit-button:hover {
  background-color: #5e70a0;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  text-align: center;
  margin-top: 1rem;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #555;
}

.login-link a {
  color: #425071;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
}
</style>
