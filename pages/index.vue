<template>
  <div class="container-fluid">
    <div class="row">
      <aside id="side-panel" class="col-3">
        <h2>Podaci</h2>
        <div v-for="(wp,i) in waypoints" :key="i">
          ID: {{wp.id}} Lat:{{ wp.lat }} Long: {{ wp.lng }}
        </div>
      </aside>
      <div class="col-9" id="map-wrap" >
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
      console.dir(latitude,longitude);
      if(e.originalEvent.target.alt != "Marker"){

        this.waypoints = [...this.waypoints,{id:this.waypoints.length,lat:latitude,lng:longitude}]
      }
    }

  }
}
</script>
<style scoped>
  #map-wrap {
    height: 100vh;
    width: 100%;
  }
</style>