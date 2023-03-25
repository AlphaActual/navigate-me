<template>
  <div class="container-fluid">
    <div class="row wrapper">

      <aside id="side-panel" class="p-4 col-3">
        <h2>Podaci</h2>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
          <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
        </div>
        <hr>
        <!-- waypoint list -->
        <WaypointCard v-for="(wp) in waypoints" :waypoint="wp" :key="wp.id" />
          
      </aside>

      <div id="map-wrap" class="col-9" >
        <client-only>
          <l-map :zoom="zoom" :center="center" @click="setmarker">
            <l-tile-layer :url="url"></l-tile-layer>
            <l-marker v-for="(wp) in waypoints" :lat-lng="[wp.lat,wp.lng]" :key="wp.id"></l-marker>
            <l-polyline ></l-polyline>
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
    updateNames(){
      // fix ovdje da bude reversed!
      this.waypoints = this.waypoints.map((wp,i)=>{return {...wp,name:i}});
    },
    setmarker(e){
      console.dir(e);
      let latitude = e.latlng.lat;
      let longitude = e.latlng.lng;
      // ako nije kliknuto na marker spremi novi waypoint u listu waypoints
      if(e.originalEvent.target.alt != "Marker"){
        const newWaypoint = {
          id: Date.now(),
          name: 0,
          lat: latitude,
          lng: longitude
        };
        // update array
        this.waypoints = [newWaypoint,...this.waypoints];
        // podesi imena (ako imamo wp1,wp2,wp3 i obrisemo wp2, potrebno je svima podesiti imena tako da se wp3 sada zove wp2)
        this.updateNames();
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
    height: 100vh;
    overflow: hidden;
  }
  #side-panel{
    height: calc(100vh);
    overflow-y: auto;
  }
</style>