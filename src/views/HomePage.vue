<template>
  <div class="home-page">
    <div class="background-image"></div>
    <div class="content">
      <h1 class="title">Otel Deneyimlerinizi Paylaşın</h1>
      <p class="subtitle">
        Konakladığınız otelleri değerlendirin, diğer gezginlere yardımcı olun
      </p>
      <div class="cta-container">
        <button v-if="!isLoggedIn" class="cta-button" @click="goToLogin">
          Hemen Başlayın
        </button>
        <router-link v-else to="/rating" class="cta-button">
          Değerlendirme Yap
        </router-link>
      </div>
    </div>
    <div class="features">
      <div class="feature">
        <i class="fas fa-hotel"></i>
        <h3>Geniş Otel Ağı</h3>
        <p>Binlerce oteli değerlendirin ve inceleyin</p>
      </div>
      <div class="feature">
        <i class="fas fa-star"></i>
        <h3>Detaylı Puanlama</h3>
        <p>Farklı kriterlere göre puanlama yapın</p>
      </div>
      <div class="feature">
        <i class="fas fa-users"></i>
        <h3>Topluluk Gücü</h3>
        <p>Diğer gezginlerin deneyimlerinden faydalanın</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem("username");
    },
  },

  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("@/assets/homebackground.jpg") no-repeat center center;
  background-size: cover;
  filter: blur(8px);
  z-index: -1;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;

  position: relative;
  z-index: 1;
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
}

.cta-container {
  margin-top: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  color: #425071;
  background-color: white;
  border: none;
  border-radius: 50px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px #425071(0, 0, 0, 0.1);
}

.features {
  display: flex;
  justify-content: space-around;
  padding: 6rem 2rem;
  background-color: rgba(20, 13, 62, 0.1);
  position: relative;
  z-index: 1;
}

.feature {
  text-align: center;
  max-width: 300px;
}

.feature i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}

.feature p {
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature {
    margin-bottom: 2rem;
  }
}
</style>
