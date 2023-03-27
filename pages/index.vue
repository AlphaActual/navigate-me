<template>
  <div class="container-fluid">
    <div class="row wrapper">

      <aside id="side-panel" class="ps-4 pt-4 pb-4 col-3">
        <h2>Create/edit route</h2>
        

        <div class="d-flex align-items-center">
          <button class="btn btn-primary" @click="sortWPs">Sort</button>
          <button class="btn btn-warning" @click="undoRemove">Undo</button>
          <span :class="['sort-arrow', 'fs-3', 'ms-1',{ 'reverse-arrow': !sortedDescending } ]">&#8595;</span>
        </div>
        <hr>
        <!-- dodaj neki transition -->
        <transition >
          <span>Active waypoint : {{activeWP.name}}</span>
        </transition>
        <hr>
        <div class="waypoint-container">
          <!-- waypoint list -->
          <WaypointCard  v-for="(wp) in showSorted" :waypoint="wp" :key="wp.id" @delete-WP-event="removeWP" @card-clicked="handleCardClick(wp)"/>
        </div>
      </aside>

      <div id="map-wrap" class="col-9" >
        <client-only>
          <l-map :zoom="zoom" :center="center" @click="handleMapClick">
            <l-tile-layer :url="url"></l-tile-layer>
            <l-marker v-for="(wp) in waypoints" :lat-lng="[wp.lat,wp.lng]" @click="markerClick(wp.id)" :key="wp.id">
              <l-popup> 
                <p>WP{{wp.name}}</p> 
                <p></p>
                </l-popup>
            </l-marker>
            <l-polyline :lat-lngs="getLinesCoordinates" ></l-polyline>
          </l-map>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
// import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
export default {
  name: 'IndexPage',
  data() {
    return {
      zoom: 13,
      center: [47.3686498, 8.5391825],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      marker: [47.3686498, 8.5391825],
      waypoints: [],
      deletedWaypoints: [],
      sortedDescending: true,
      activeWP: 0

      
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
    setActiveWP(wp){
      this.activeWP = wp;
    },
    markerClick(id){
      const updatedNewWPindex = this.waypoints.findIndex(wp=>wp.id === id);
        // postavi ga kao aktivnog
      const selectedWP = this.waypoints[updatedNewWPindex];
      this.setActiveWP(selectedWP)
      // centriraj aktivan wp
      this.center = [selectedWP.lat,selectedWP.lng];


    },
    updateNames(){
      let indexes = this.waypoints.map((_e,i)=>i)
      let updatedArray = indexes.map(index=>{return {...this.waypoints[index],name:index}});
      this.waypoints = updatedArray;

    },
    handleMapClick(e){
      if(e.originalEvent.target.alt != "Marker"){
        this.setmarker(e);
      }else{
        // console.log(e);
      }
    },
    handleCardClick(wp){
      this.setActiveWP(wp)
      this.center = [wp.lat,wp.lng];
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
        // ubaci novi waypoint u waypoints array na nacin:

        // ako je waypoints array prazan ubaci na zadnje mjesto
        // ako je zadnji waypoint === aktivni ubaci na zadnje mjesto
        // ako je neki drugi waypoint aktivan zamjeni ga u arrayu sa ovim novim
        if(!this.waypoints.length || this.waypoints[this.waypoints.length-1].id === this.activeWP.id){
          this.waypoints = [...this.waypoints,newWaypoint];
        }else {
          this.waypoints = this.waypoints.map(wp=>{
            if(wp.id === this.activeWP.id) return newWaypoint
            else return wp;
          })
        }

        // podesi imena (ako imamo wp1,wp2,wp3 i obrisemo wp2, potrebno je svima podesiti imena tako da se wp3 sada zove wp2)
        this.updateNames();
        // pronadi index to waypointa (nakon sto su sva imena updejtana)
        const updatedNewWPindex = this.waypoints.findIndex(wp=>wp.id === newWaypoint.id);
        // postavi ga kao aktivnog
        this.setActiveWP(this.waypoints[updatedNewWPindex])       
      }
    },
    
    removeWP(id){
      const wpToRemove = this.waypoints[this.waypoints.findIndex(wp=>wp.id === id)];
      // dodaj ga u deletedwaypoints
      this.deletedWaypoints = [...this.deletedWaypoints,wpToRemove];

      // izbaci ga iz waypoints liste
      this.waypoints = this.waypoints.filter(wp=>wp.id !== id)
      this.updateNames();
      // ako je obrisani wp bio ujedno i aktivan stavi da novi aktivni bude zadnji
      if(this.activeWP.id === id){
        const lastWP = this.waypoints[this.waypoints.length -1];
        this.setActiveWP(lastWP)
      }
      
    },
    undoRemove(){
      // ubaci zadnji ubaceni wp iz deletedWaypoints nazad u waypoints na pripadajuce mjesto
      if(this.deletedWaypoints.length != 0){
        // kloniranje liste (kako ne bi doslo do mutacija originala)
        const newWaypoints =  [...this.waypoints];
        const lastDeletedWP = this.deletedWaypoints[this.deletedWaypoints.length -1];
        // insertaj u listu obrisani element na njegovo staro mjesto u redosljedu
        newWaypoints.splice(lastDeletedWP.name,0,lastDeletedWP);
        // spremi promjene
        this.waypoints = newWaypoints;
      }
      // obrisi zadnji element iz deletedWaypoints
      this.deletedWaypoints = [...this.deletedWaypoints].pop();
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
    /* overflow-y: auto; */
  }
  .waypoint-container {
    overflow: auto;
    height:60%;
    margin-bottom:200px ;
  }
  .reverse-arrow {
    transform: rotate(180deg);
  }
  .active {
    border: 1px solid blue;
  }
</style>