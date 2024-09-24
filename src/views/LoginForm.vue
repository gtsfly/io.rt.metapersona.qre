<template>
  <div class="background-image"></div>
  <div class="login-page">
    <div class="form-container">
      <h2 class="form-title">Hoş Geldiniz</h2>
      <p class="form-subtitle">
        Otel deneyimlerinizi paylaşmak için giriş yapın
      </p>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">E-posta</label>
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
          <label for="password">Şifre</label>
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
            :class="isLoading ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'"
          ></i>
          {{ isLoading ? "Giriş yapılıyor..." : "Giriş Yap" }}
        </button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="register-link">
        Hesabınız yok mu?
        <router-link to="/register">Kayıt Ol</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { login } from "@/services/authService";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  mounted() {
    this.email = this.$route.query.email;
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const response = await login(this.email, this.password);
        console.log("Giriş cevabı:", response);

        if (response.status === 200) {
          const userId = response.data.userId;
          localStorage.setItem("userId", userId);
          localStorage.setItem("username", this.email);
          console.log(
            "Kaydedilen kullanıcı adı:",
            localStorage.getItem("username")
          );

          this.$router.push({ name: "rating" }).then(() => {
            window.location.reload();
          });
        } else {
          this.errorMessage =
            "Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.";
        }
      } catch (error) {
        console.error("Giriş hatası:", error);
        this.errorMessage =
          "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
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
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
  position: relative;
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  z-index: 2;
}

.form-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.form-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
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
  padding-left: 40px;
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

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.forgot-password {
  color: #425071;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.submit-button {
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

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #555;
}

.register-link a {
  color: #425071;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: #f44336;
  text-align: center;
  margin-top: 1rem;
}
</style>
