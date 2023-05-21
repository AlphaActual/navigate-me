<template>
  <div class="container-fluid">
    <div class="row align-items-center">
      <div class="col-5 image-col">
        <img
          class="img-fluid compass"
          src="../assets/img/kompas.svg"
          alt="compass"
        />
      </div>

      <div class="col">
        <h1 class="main-title display-3">NAVIGATE ME</h1>
        <div v-in-viewport class="form-container slide">
          <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label"
                >Email address</label
              >
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label"
                >Password</label
              >

              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
              />
              <div id="emailHelp" class="form-text">Enter your pasword</div>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword2" class="form-label"></label>
              Enter a Password

              <input
                type="password"
                class="form-control"
                id="exampleInputPassword2"
              />
              <div id="emailHelp" class="form-text">
                Enter your pasword one more time
              </div>
            </div>

            <button type="button" class="login-button btn btn-outline-primary">
              Register
            </button>
          </form>
          <hr />
          <p class="reg-title display-2">You already have an account ?</p>
          <div style="margin-top: 30px">
            <button
              ype="button"
              class="login-button btn btn-outline-primary"
              @click="redirectToLogin"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <img class="path-image" src="../assets/img/path.svg" alt="path" />
    </div>
  </div>
</template>

<script>
// za koristenje v-in-viewport
import Vue from "vue";
import inViewportDirective from "vue-in-viewport-directive";
Vue.directive("in-viewport", inViewportDirective);

export default {
  name: "Login",
  transition: "fade",

  mounted() {
    const compass = document.querySelector(".compass");
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });
    function updateCompass() {
      const rect = compass.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      let targetAngle =
        ((Math.atan2(deltaY, deltaX) * 180) / Math.PI + 360) % 360;
      const transformValues = compass.style.transform.split(/\w+\(|\);?/);
      const currentAngle = parseFloat(transformValues[1]) || 0;
      let angleDiff = targetAngle - currentAngle;

      if (angleDiff < -180) {
        angleDiff += 360;
      } else if (angleDiff > 180) {
        angleDiff -= 360;
      }

      targetAngle = currentAngle + angleDiff;
      const rotation = `rotateZ(${targetAngle + 90}deg)`;

      if (distance < 100) {
        compass.style.transition = `transform .066s ease-in-out`;
      } else {
        compass.style.transition = `transform ${distance / 1500}s ease-in-out`;
      }

      compass.style.transform = `${rotation}`;
    }

    setInterval(updateCompass, 16);
  },
  methods: {
    redirectToLogin() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cinzel&family=Open+Sans&display=swap");
@import "~/assets/css/main.css";
.main-title {
  font-family: "Cinzel", "Times New Roman", Times, serif, sans-serif;
  color: var(--brown-main);
}
@media screen and (max-width: 1500px) {
  .main-title {
    font-size: 3.5rem;
  }
}

.container-fluid {
  /* background: url('~assets/img/chart-bg.png'); */
  /* background-color: inherit; */
  background-size: cover;
  background-position: center;
}
.path-image {
  width: 20vw;
  max-width: 300px;
  position: absolute;
  right: 13%;
  bottom: -41%;
}
.image-col {
  overflow: hidden;
}
/* .image-col > img {
      max-width: 80%;
    } */
.row {
  height: 100vh;
}
.form-container {
  width: 50%;
}
.login-button {
  display: block;
  width: 100%;
  text-align: center;
  color: black;
  border-color: var(--brown-main);
}
.login-button:hover {
  background-color: var(--brown-main);
  color: white;
}
</style>
