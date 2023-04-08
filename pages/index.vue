<template>
<div class="container-fluid">
  <div class="row align-items-center">
    <div class="col">
      <img class="img-fluid compass" src="../assets/img/compass.svg" alt="">
    </div>
    <div class="col">
      <div class="form-container">
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
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <nuxt-link to="/add-edit-route"><button class="mt-3 btn btn-outline-success">Dodaj rutu</button></nuxt-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name:'Main page',
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
      // const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
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
      console.log(targetAngle)
      
      compass.style.transition = `transform ${distance/1500}s ease-in-out`;
      compass.style.transform = `${rotation}`;
      
    }

    setInterval(updateCompass, 16);
  }
}
</script>

<style scoped>
  .row {
    height: 100vh;
  }
  .form-container{
    width: 50%;
  }
  
</style>