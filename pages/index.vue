<template>
<div class="container">
  <div class="row justify-content-center align-items-center">
    <div class="col">
      <img class="img-fluid spinning-wheel" src="../assets/img/compass.svg" alt="">
    </div>
    <div class="col">
      <nuxt-link to="/add-edit-route"><button class="btn btn-outline-success">Dodaj rutu</button></nuxt-link>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name:'Main page'
}
</script>

<style scoped>
  .row {
    height: 100vh;
  }

  .spinning-wheel {
  animation: spin 5s infinite;
  animation-fill-mode: infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    animation-timing-function: ease-out;
  }
  20% {
    transform: rotate(270deg);
    animation-timing-function: ease-in;
  }
  30% {
    transform: rotate(270deg);
    animation-timing-function: ease-in;
  }
  40% {
    transform: rotate(270deg);
    animation-timing-function: ease-in;
  }
  50% {
    transform: rotate(270deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: rotate(-180deg);
    animation-timing-function: ease-out;
  }
  70% {
    transform: rotate(-180deg);
    animation-timing-function: ease-out;
  }
  80% {
    transform: rotate(-180deg);
    animation-timing-function: ease-out;
  }
  90% {
    transform: rotate(-180deg);
    animation-timing-function: ease-out;
  }
  100% {
    transform: rotate(360deg);
    animation-timing-function: ease-in;
  }
}

</style>