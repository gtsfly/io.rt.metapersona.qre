<template>
  <div class="rating-page">
    <h1 class="page-title">Otel Deneyimi Değerlendirmesi</h1>
    <div class="search-container">
      <div class="autocomplete">
        <input
          v-model="searchQuery"
          @input="searchHotels"
          type="text"
          placeholder="Otel ara..."
          class="search-input"
        />
        <ul v-if="filteredHotels.length" class="autocomplete-results">
          <li
            v-for="hotel in filteredHotels"
            :key="hotel.hotelId"
            @click="selectHotel(hotel)"
            class="autocomplete-result"
          >
            {{ hotel.hotelName }}
          </li>
        </ul>
      </div>
    </div>

    <div class="matrix-container" ref="matrixContainer">
      <div class="table-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="hotel-column sticky-header">Otel / Deneyim</th>
              <th
                v-for="experience in experiences"
                :key="experience.experienceId"
                class="experience-column sticky-header"
              >
                {{ experience.experienceName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="hotel in paginatedHotels"
              :key="hotel.hotelId"
              :ref="`hotel-${hotel.hotelId}`"
            >
              <td class="hotel-name">{{ hotel.hotelName }}</td>
              <td
                v-for="experience in experiences"
                :key="experience.experienceId"
                class="rating-cell"
              >
                <input
                  v-model.number="
                    ratings[`${hotel.hotelId}-${experience.experienceId}`]
                  "
                  type="number"
                  min="1"
                  max="10"
                  :class="{
                    'error-input': isInvalidRating(
                      hotel.hotelId,
                      experience.experienceId
                    ),
                    'rating-filled': isRatingPresent(
                      hotel.hotelId,
                      experience.experienceId
                    ),
                  }"
                  @change="
                    validateAndUpdateRating(
                      hotel.hotelId,
                      experience.experienceId
                    )
                  "
                  :ref="`rating-${hotel.hotelId}-${experience.experienceId}`"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Önceki</button>
      <span>Sayfa {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Sonraki
      </button>
    </div>
  </div>
</template>

<script>
import {
  getHotels,
  getExperiences,
  submitRating,
  getUserId,
  getUserRatings,
} from "@/services/authService";

export default {
  data() {
    return {
      userId: null,
      userEmail: "",
      ratings: {},
      hotels: [],
      experiences: [],
      hasLoaded: false,
      searchQuery: "",
      filteredHotels: [],
      currentPage: 1,
      itemsPerPage: 20,
    };
  },
  computed: {
    paginatedHotels() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.hotels.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.hotels.length / this.itemsPerPage);
    },
  },
  async mounted() {
    if (!this.hasLoaded) {
      this.fetchUserEmail();
      await this.fetchUserId();
      await Promise.all([
        this.fetchHotels(),
        this.fetchExperiences(),
        this.fetchUserRatings(),
      ]);
      this.hasLoaded = true;
    }
  },
  methods: {
    fetchUserEmail() {
      this.userEmail = localStorage.getItem("username") || "";
      if (!this.userEmail) {
        console.error("Kullanıcı e-postası bulunamadı");
      }
    },

    async fetchUserId() {
      try {
        if (!this.userEmail) {
          throw new Error("Kullanıcı e-postası mevcut değil");
        }
        const email = localStorage.getItem("username");
        this.userId = await getUserId(email);
      } catch (error) {
        console.error("Kullanıcı ID'si alınırken hata oluştu:", error);
      }
    },

    async fetchHotels() {
      try {
        const response = await getHotels();
        this.hotels = response.data;
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    },

    async fetchExperiences() {
      try {
        const response = await getExperiences();
        this.experiences = response.data;
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    },

    async fetchUserRatings() {
      try {
        const email = localStorage.getItem("username");
        if (!email) {
          throw new Error("Kullanıcı e-postası bulunamadı");
        }
        const response = await getUserRatings(this.userId);
        this.ratings = response.data.reduce((acc, rating) => {
          acc[`${rating.hotelId}-${rating.experienceId}`] = rating.rating;
          return acc;
        }, {});
        console.log("Fetched ratings:", this.ratings);
      } catch (error) {
        console.error("Kullanıcı oyları alınırken hata oluştu:", error);
      }
    },

    async validateAndUpdateRating(hotelId, experienceId) {
      const rating = this.ratings[`${hotelId}-${experienceId}`];
      const refName = `rating-${hotelId}-${experienceId}`;
      if (rating > 10 || rating < 1) {
        this.$nextTick(() => {
          const inputRef = this.$refs[refName];
          if (inputRef && typeof inputRef.focus === "function") {
            inputRef.focus();
          }
        });
        return;
      }
      await this.updateRating(hotelId, experienceId, rating);
    },

    async updateRating(hotelId, experienceId, rating) {
      if (!this.userId) {
        console.error("User ID is not available.");
        return;
      }
      try {
        const response = await submitRating({
          userId: this.userId,
          hotelId,
          experienceId,
          rating,
        });
        if (response.status === 200) {
          console.log("Rating submitted successfully");
        } else {
          console.error(
            "Failed to submit rating, status code:",
            response.status
          );
        }
      } catch (error) {
        console.error(
          "Error submitting rating:",
          error.response ? error.response.data : error.message
        );
      }
    },

    isInvalidRating(hotelId, experienceId) {
      const rating = this.ratings[`${hotelId}-${experienceId}`];
      return rating > 10 || rating < 1;
    },

    isRatingPresent(hotelId, experienceId) {
      return this.ratings[`${hotelId}-${experienceId}`] !== undefined;
    },

    searchHotels() {
      if (this.searchQuery.trim() === "") {
        this.filteredHotels = [];
        return;
      }

      const lowerCaseQuery = this.searchQuery.toLowerCase();
      this.filteredHotels = this.hotels
        .filter((hotel) =>
          hotel.hotelName.toLowerCase().includes(lowerCaseQuery)
        )
        .slice(0, 5);
    },

    selectHotel(hotel) {
      this.searchQuery = hotel.hotelName;
      this.filteredHotels = [];

      const hotelIndex = this.hotels.findIndex(
        (h) => h.hotelId === hotel.hotelId
      );
      if (hotelIndex !== -1) {
        const pageIndex = Math.floor(hotelIndex / this.itemsPerPage) + 1;
        this.currentPage = pageIndex;

        this.$nextTick(() => {
          const hotelElement = this.$refs[`hotel-${hotel.hotelId}`][0];
          if (hotelElement) {
            hotelElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            hotelElement.classList.add("highlight");
            setTimeout(() => {
              hotelElement.classList.remove("highlight");
            }, 2000);
          }
        });
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
.rating-page {
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  padding: 10px;
  font-family: Arial, sans-serif;
  overflow-x: hidden;
}

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.matrix-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 150px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.table-wrapper {
  min-width: 900px;
}

.matrix-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.8rem;
}

.matrix-table th,
.matrix-table td {
  border: 1px solid #e0e0e0;
  padding: 6px 4px;
  text-align: left;
  white-space: nowrap;
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: #f5f5f5;
  z-index: 10;
}

.hotel-column {
  position: sticky;
  left: 0;
  background-color: #f5f5f5;
  z-index: 20;
}

.hotel-name {
  position: sticky;
  left: 0;
  background-color: #fff;
  font-weight: bold;
  z-index: 5;
}

.experience-column {
  min-width: 80px;
}

.rating-cell {
  padding: 2px;
}

.rating-cell input {
  width: 100%;
  max-width: 50px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.rating-cell input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 3px rgba(76, 175, 80, 0.5);
  outline: none;
}

.error-input {
  border-color: #f44336 !important;
  background-color: #ffebee;
}

.rating-cell input.rating-filled {
  background-color: #e8f5e9;
  border-color: #4caf50;
  color: #2e7d32;
  font-weight: bold;
}

@media screen and (max-width: 1200px) {
  .matrix-table {
    font-size: 0.7rem;
  }

  .rating-cell input {
    font-size: 0.7rem;
    padding: 2px;
  }
}

.search-container {
  margin-bottom: 20px;
  text-align: center;
}

.autocomplete {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.autocomplete-results {
  position: absolute;
  background-color: white;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.autocomplete-result {
  padding: 10px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #f0f0f0;
}

.highlight {
  background-color: #fff9c4;
  transition: background-color 0.5s ease;
}

@keyframes highlightAnimation {
  0% {
    background-color: #fff9c4;
  }
  50% {
    background-color: #ffeb3b;
  }
  100% {
    background-color: #fff9c4;
  }
}

.highlight {
  animation: highlightAnimation 2s ease;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-controls span {
  font-size: 1rem;
}
</style>
