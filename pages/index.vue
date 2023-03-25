<template>
  <div class="main-container">
    <div class="d-flex wrapper">

      <aside id="side-panel" class="p-4">
        <h2>Podaci</h2>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
          <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
        </div>
        <hr>
        <div v-for="(wp,i) in waypoints" :key="i">
          ID: {{wp.id}} Lat:{{ wp.lat }} Long: {{ wp.lng }}
        </div>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis quos doloribus deleniti neque facere tenetur fuga nostrum expedita repellendus. Iusto illum iste exercitationem voluptatibus eligendi ipsa omnis similique asperiores eius deleniti, officia sit minima sunt ex doloremque vero natus culpa beatae temporibus cupiditate unde mollitia dolores tenetur. Autem dolorum sapiente, sit obcaecati numquam iusto laboriosam nisi. Quae mollitia commodi nam placeat excepturi tempore porro quis, eaque, itaque fugiat aperiam officia beatae sunt, dignissimos corrupti quisquam incidunt vel. Perspiciatis, nesciunt reprehenderit sequi dicta, praesentium provident architecto quod excepturi autem sunt eos asperiores vero facere! Dolorem perspiciatis ea eligendi ex nisi cupiditate!</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis quos doloribus deleniti neque facere tenetur fuga nostrum expedita repellendus. Iusto illum iste exercitationem voluptatibus eligendi ipsa omnis similique asperiores eius deleniti, officia sit minima sunt ex doloremque vero natus culpa beatae temporibus cupiditate unde mollitia dolores tenetur. Autem dolorum sapiente, sit obcaecati numquam iusto laboriosam nisi. Quae mollitia commodi nam placeat excepturi tempore porro quis, eaque, itaque fugiat aperiam officia beatae sunt, dignissimos corrupti quisquam incidunt vel. Perspiciatis, nesciunt reprehenderit sequi dicta, praesentium provident architecto quod excepturi autem sunt eos asperiores vero facere! Dolorem perspiciatis ea eligendi ex nisi cupiditate!</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis quos doloribus deleniti neque facere tenetur fuga nostrum expedita repellendus. Iusto illum iste exercitationem voluptatibus eligendi ipsa omnis similique asperiores eius deleniti, officia sit minima sunt ex doloremque vero natus culpa beatae temporibus cupiditate unde mollitia dolores tenetur. Autem dolorum sapiente, sit obcaecati numquam iusto laboriosam nisi. Quae mollitia commodi nam placeat excepturi tempore porro quis, eaque, itaque fugiat aperiam officia beatae sunt, dignissimos corrupti quisquam incidunt vel. Perspiciatis, nesciunt reprehenderit sequi dicta, praesentium provident architecto quod excepturi autem sunt eos asperiores vero facere! Dolorem perspiciatis ea eligendi ex nisi cupiditate!</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis quos doloribus deleniti neque facere tenetur fuga nostrum expedita repellendus. Iusto illum iste exercitationem voluptatibus eligendi ipsa omnis similique asperiores eius deleniti, officia sit minima sunt ex doloremque vero natus culpa beatae temporibus cupiditate unde mollitia dolores tenetur. Autem dolorum sapiente, sit obcaecati numquam iusto laboriosam nisi. Quae mollitia commodi nam placeat excepturi tempore porro quis, eaque, itaque fugiat aperiam officia beatae sunt, dignissimos corrupti quisquam incidunt vel. Perspiciatis, nesciunt reprehenderit sequi dicta, praesentium provident architecto quod excepturi autem sunt eos asperiores vero facere! Dolorem perspiciatis ea eligendi ex nisi cupiditate!</p>
      </aside>

      <div id="map-wrap" >
        <client-only>
          <l-map :zoom="zoom" :center="center" @click="setmarker">
            <l-tile-layer :url="url"></l-tile-layer>
            <l-marker v-for="(wp,i) in waypoints" :lat-lng="[wp.lat,wp.lng]" :key="i"></l-marker>
            <!-- <l-polyline ></l-polyline> -->
          </l-map>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'IndexPage',
  data() {
    return {
      zoom: 13,
      center: [47.3686498, 8.5391825],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      marker: [47.3686498, 8.5391825],
      waypoints: []

    }
  },
  methods: {
    setmarker(e){
      console.dir(e);
      let latitude = e.latlng.lat;
      let longitude = e.latlng.lng;
      // ako nije kliknuto na marker spremi novi waypoint u listu waypoints
      if(e.originalEvent.target.alt != "Marker"){
        this.waypoints = [...this.waypoints,{id:this.waypoints.length,lat:latitude,lng:longitude}]
      }
    }

  }
}
</script>
<style scoped>
  body {
    overflow: hidden;
    height: 100vh;
  }
  .wrapper {
    overflow-y: hidden;
  }
  #map-wrap {
    /* position: fixed;
    right:0px; */
    height: 100vh;
    width: 70%;
    overflow: hidden;
  }
  #side-panel{
    width: 30%;
    height: calc(100vh);
    overflow-y: scroll;
  }
</style>