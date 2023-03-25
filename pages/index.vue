<template>
  <div class="container-fluid">
    <div class="row wrapper">

      <aside id="side-panel" class="p-4 col-3">
        <h2>Podaci</h2>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
          <label class="form-check-label" for="flexSwitchCheckDefault">Testni prekidač</label>
        </div>

        <div class="d-flex align-items-center">
          <button class="btn btn-primary" @click="sortWPs">Sort</button>
          <span :class="['sort-arrow', 'fs-3', 'ms-1',{ 'reverse-arrow': !sortedDescending } ]">&#8595;</span>
        </div>
        
        <hr>
        <!-- waypoint list -->
        <WaypointCard v-for="(wp) in showSorted" :waypoint="wp" :key="wp.id" @delete-WP-event="removeWP"/>
      </aside>

      <div id="map-wrap" class="col-9" >
        <client-only>
          <l-map :zoom="zoom" :center="center" @click="setmarker">
            <l-tile-layer :url="url"></l-tile-layer>
            <l-marker v-for="(wp) in waypoints" :lat-lng="[wp.lat,wp.lng]" :key="wp.id"></l-marker>
            <l-polyline :lat-lngs="getLinesCoordinates" ></l-polyline>
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
      waypoints: [],
      sortedDescending: true,
      
      
    }
  },
  computed: {
    showSorted(){
      if(this.sortedDescending){
        return [...this.waypoints].reverse();
      }else{
        return this.waypoints;
      }
    },
    getLinesCoordinates(){
      return [this.waypoints.map(wp=>[wp.lat,wp.lng])];
    }

  },
  
  methods: {
    updateNames(){
      let indexes = this.waypoints.map((_e,i)=>i)
      let updatedArray = indexes.map(index=>{return {...this.waypoints[index],name:index}});
      this.waypoints = updatedArray;

    },
    sortWPs(){
      this.sortedDescending = !this.sortedDescending;
    },
    setmarker(e){
      let latitude = e.latlng.lat;
      let longitude = e.latlng.lng;
      let datum = new Date;
      // ako nije kliknuto na marker spremi novi waypoint u listu waypoints
      if(e.originalEvent.target.alt != "Marker"){
        const newWaypoint = {
          id: Date.now(),
          name: 0,
          lat: latitude,
          lng: longitude,
          timeCreated: `${datum.getHours()}:${datum.getMinutes()}:${datum.getSeconds()}`
        };
        // ubaci novi waypoint u waypoints array
        this.waypoints = [...this.waypoints,newWaypoint];
        // podesi imena (ako imamo wp1,wp2,wp3 i obrisemo wp2, potrebno je svima podesiti imena tako da se wp3 sada zove wp2)
        this.updateNames();        
      }
    },
    
    removeWP(id){
      this.waypoints = this.waypoints.filter(wp=>wp.id !== id)
      this.updateNames();
      // this.updateLines();
    }

  }
}
</script>
<style scoped>
  * {
    transition:all 400ms ease;
  }
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
  .reverse-arrow {
    transform: rotate(180deg);
  }
</style>