<template>
  <div
    id="header"
    class="header d-flex justify-content-between align-items-center ps-2 pe-2"
  >
    <div class="fw-bold text-brown-main fs-5 d-flex">
      <nuxt-link v-if="back" :to="back" class="text-brown-main back-link">
        <div class="hover-effect ms-2">
          <i class="fa-solid fa-arrow-left"></i>
          <div class="original-text">
            {{ pageTitle }}
          </div>
          <div class="new-text">Back to {{ back.slice(1) }}</div>
        </div>
      </nuxt-link>
      <div v-else class="original-text ms-2">
        {{ pageTitle }}
      </div>
    </div>
    <div id="total-time">
      Total time: <span class="fw-bold text-brown-main"> {{ totalT }}</span> hrs
    </div>
    <div>
      Total distance:
      <span class="fw-bold text-brown-main"> {{ totalD.toFixed(2) }}</span> NM
    </div>
    <div>
      <p v-if="userEmail">Hello, {{ userEmail }}</p>
      <p v-else>Welcome, Guest</p>
    </div>
    <div class="logout-gumb-container">
      <button
        v-show="showTutorial"
        :disabled="this.$store.state.tutorialVisible"
        class="logout-gumb btn"
        @click="
          () => {
            this.startTutorial();
            $emit('load-route');
          }
        "
      >
        Tutorial
      </button>
      <button class="logout-gumb btn" @click="logout">Logout</button>
    </div>
  </div>
</template>
<script>
import { FirebaseError } from "firebase/app";

import { app } from "~/plugins/firebase.js";
import { auth } from "~/plugins/firebase.js";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "Header",
  data() {
    return {
      userEmail: null, // Initialize with null or an empty string
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      // Use auth instead of this.$auth
      if (user) {
        this.userEmail = user.email;
      } else {
        this.userEmail = null;
        this.$router.push("/");
        // Reset the email when the user signs out
      }
    });
  },
  props: {
    back: {
      type: String,
      required: false,
    },
    pageTitle: {
      type: String,
      required: true,
    },
    totalD: {
      type: Number,
      required: true,
    },
    totalT: {
      type: String,
      required: true,
    },
    showTutorial: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  methods: {
    startTutorial() {
      this.$store.commit("setTutorialVisibility", true);
    },
    logout() {
      this.isLoggedIn = false;
      signOut(auth);
      this.$router.replace({ name: "index" });
    },
  },
};
</script>
<style scoped>
@import "~/assets/css/main.css";

.header {
  height: 40px;
  border-bottom: 1px solid gray;
}

.hover-effect {
  position: relative;
  min-width: 200px;
}

.hover-effect .original-text {
  position: absolute;
  top: 0;
  left: 25px;
  visibility: visible;
  opacity: 1;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.hover-effect:hover .original-text {
  visibility: hidden;
  opacity: 0;
  transform: translateY(50%);
}

.hover-effect:hover .new-text {
  visibility: visible;
  transform: translateY(0);
  opacity: 1;
}

.new-text {
  transition: all 0.3s ease;
  position: absolute;
  top: 0;
  left: 25px;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-50%);
}

.back-link:hover {
  text-decoration: none;
  color: --var(brown-main);
}
.logout-gumb {
  background-color: var(--primary-blue);
  color: white;
  padding: 0px 0.5rem;
}
.logout-gumb:hover {
  background-color: var(--primary-blue-hover);
}
</style>
