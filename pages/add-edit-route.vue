<template>
  <div class="main-div">
     <Header pageTitle="Create/edit route" />
  <div class="container-fluid">
    <div class="row wrapper">

      <aside id="side-panel" class="ps-4 pt-4 pb-4 col-md-3 col-sm-12">
        <div>
          <div>
            <button class="save-btn btn btn-primary d-block">Save route</button>
          </div>
        </div>
        

        <div class="d-flex align-items-center">
          <button class="btn btn-outline-secondary" @click="sortWPs">Sort</button>
          <span :class="['sort-arrow', 'fs-3', 'ms-1',{ 'reverse-arrow': !sortedDescending } ]">&#8595;</span>
        </div>
        <hr>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn border border-primary rounded" @click="centerOnActive">Active: <span class="fw-bold text-primary">{{activeWP.name}}</span></div>
            <div @click="removeWP(activeWP.id)" class="btn btn-danger">Delete active</div>
          </div>
        <hr>
        <div class="waypoint-container">
          <!-- waypoint list -->
          <WaypointCard  v-for="(wp) in showSorted" :waypoint="wp" :key="wp.id" @delete-WP-event="removeWP" @card-clicked="handleCardClick(wp)"/>
        </div>
      </aside>

      <div id="map-wrap" class="col-md-9 col-sm-12" >
        <client-only>
          <l-map :zoom="zoom" :center="center" @click="handleMapClick">
            <l-tile-layer :url="url"></l-tile-layer>
            <l-marker v-for="(wp) in waypoints" :lat-lng="[wp.lat,wp.lng]" @click="markerClick(wp.id)" :key="wp.id">
              <l-popup> 
                <p class="p-0 m-0">WP{{wp.name}}</p> 
                <p class="p-0 m-0">Next course {{wp.nextCourse != 'N/A'? Math.floor(wp.nextCourse)+'°':'N/A'}}</p>
                <p class="p-0 m-0">Wp to Wp: {{ wp.wpToWp != 'N/A'? wp.wpToWp.toFixed(2) + ' NM':'N/A'}}</p>
                </l-popup>
            </l-marker>
            <l-polyline :lat-lngs="getLinesCoordinates" ></l-polyline>
          </l-map>
        </client-only>
      </div>
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
      zoom: 15,
      center: [45.08397548484512, 13.633303642272951],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      marker: [45.08397548484512, 13.633303642272951],
      waypoints: [],
      deletedWaypoints: [],
      sortedDescending: true,
      activeWP: 0,
      shipSpeed: 7

      
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
      if(this.waypoints.length > 0){
        let indexes = this.waypoints.map((_e,i)=>i)
        let updatedArray = indexes.map(index=>{return {...this.waypoints[index],name:index}});
        this.waypoints = updatedArray;
        this.calculateNavData();
      }

    },
    handleMapClick(e){
      if(e.originalEvent.target.alt != "Marker"){
        this.setmarker(e);
      };
    },
    handleCardClick(wp){
      this.setActiveWP(wp)
      this.center = [wp.lat,wp.lng];
    },
    centerOnActive(){
      if(this.activeWP){
        this.center = [this.activeWP.lat,this.activeWP.lng];
      }
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
          nextCourse: 'N/A',
          wpToWp: 'N/A',
          timeCreated: `${datum.getFullYear()}-${String(datum.getMonth()+1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')} ${datum.getHours()}:${datum.getMinutes()}:${datum.getSeconds()}`
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
      if(id){
        // izbaci ga iz waypoints liste
        this.waypoints = this.waypoints.filter(wp=>wp.id !== id)
        this.updateNames();
        // ako je obrisani wp bio ujedno i aktivan stavi da novi aktivni bude zadnji
        if(this.activeWP.id === id){
          const lastWP = this.waypoints[this.waypoints.length -1];
          if(lastWP){
            this.setActiveWP(lastWP)
          }
        }
      }
    }, 
    calculateCourse(wp1,wp2) {
      let dLon = (wp2.lng - wp1.lng);
      let y = Math.sin(dLon) * Math.cos(wp2.lat);
      let x = Math.cos(wp1.lat) * Math.sin(wp2.lat) - Math.sin(wp1.lat) * Math.cos(wp2.lat) * Math.cos(dLon);
      let brng = Math.atan2(y, x) * 180 / Math.PI;
      return (brng + 360) % 360;
    },
     calculateDistance(wp1,wp2) {
      let R = 6371e3; // radius of the earth in meters
      let phi1 = wp1.lat * Math.PI/180;
      let phi2 = wp2.lat * Math.PI/180;
      let deltaPhi = (wp2.lat-wp1.lat) * Math.PI/180;
      let deltaLambda = (wp2.lng-wp1.lng) * Math.PI/180;

      let a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let distance = R * c;

      let nauticalMilesPerMeter = 0.000539957;
      let distanceInNauticalMiles = distance * nauticalMilesPerMeter;

      return distanceInNauticalMiles;
    },
    getTotalDistance(){
      let totalDistance = this.waypoints.reduce((acc,wp)=>{wp.wpToWp != 'N/A'? acc + wp.wpToWp:acc+0},0);
    },
    calculateNavData(){
      if(this.waypoints.length > 1){
        let updatedWPs = [...this.waypoints];
        updatedWPs.forEach((wp,i)=>{
          if(this.waypoints[i+1]){
            wp.nextCourse = this.calculateCourse(wp,this.waypoints[i+1])
            wp.wpToWp = this.calculateDistance(wp,this.waypoints[i+1]);
          }
        })
        this.waypoints = updatedWPs;
        console.log(this.waypoints);
      }
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
  .main-div{
    height: 100vh;
    overflow: hidden;
  }
  .wrapper {
    overflow-y: hidden;
  }
  #map-wrap {
    /* header je 40 px */
    height: calc(100vh - 40px);
    overflow: hidden;
  }
  #side-panel{
    height: 100%;
    /* overflow-y: scroll; */
  }
  .waypoint-container {
    overflow: auto;
    height: calc(100vh - 300px);
    margin-bottom: 200px;
  }
  .save-btn {
    width: 100%;
  }
  .reverse-arrow {
    transform: rotate(180deg);
  }
  .active {
    border: 1px solid blue;
  }

  @media(max-width: 768px){
    #side-panel,#map-wrap {
      height: 50vh;
    }
    body,.wrapper {
      overflow: auto;
    }
  }
</style>