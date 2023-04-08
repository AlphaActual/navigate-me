<template>
  <div class="container-fluid">
    <div class="row align-items-center">
      <div class="col image-col">
        <img class="img-fluid compass" src="../assets/img/compass.svg" alt="compass">  
      </div>
      
      <div class="col">
        <div v-in-viewport class="form-container slide">
          <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email address</label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
              <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Password</label>
              <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <button type="text" class="login-button btn btn-outline-primary">Login</button>
          </form>
          
          <nuxt-link to="/add-edit-route"><button class="mt-3 btn btn-outline-success">Dodaj rutu</button></nuxt-link>
        </div>
  
      </div>
    </div>
  </div>
</template>

<script>
// za koristenje v-in-viewport
import Vue from 'vue'
import inViewportDirective from 'vue-in-viewport-directive'
Vue.directive('in-viewport', inViewportDirective)

export default {
  name:'login',
  transition: 'fade',
  
  mounted(){
    const compass = document.querySelector('.compass');
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', event => {
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
      let targetAngle = (Math.atan2(deltaY, deltaX) * 180 / Math.PI + 360) % 360;
      const transformValues = compass.style.transform.split(/\w+\(|\);?/);
      const currentAngle = parseFloat(transformValues[1]) || 0;
      let angleDiff = targetAngle - currentAngle;

      if (angleDiff < -180) {
        angleDiff += 360;
      } else if (angleDiff > 180) {
        angleDiff -= 360;
      }

      targetAngle = currentAngle + angleDiff;
      const rotation = `rotateZ(${targetAngle +90}deg)`;
      
      compass.style.transition = `transform ${distance/1500}s ease-in-out`;
      compass.style.transform = `${rotation}`;
      
    }

    setInterval(updateCompass, 16);
  }
}
</script>

<style scoped>
  
  .container-fluid {
    /* background: url('~assets/img/chart-bg.png'); */
    /* background-color: inherit; */
    background-size: cover;
    background-position: center;
    
  }
  
  .image-col {
    overflow: hidden;
  }
  .row {
    height: 100vh;
  }
  .form-container{
    width: 50%;
  }
  .login-button {
    display: block;
    width: 100%;
    text-align: center;
  }
  
</style>