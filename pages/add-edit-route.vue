<template>
  <div class="main-div">
     <Header pageTitle="Create/edit route" :totalD="totalDistance" :totalT="this.formatTime(this.totalTimeHrs)" />
  <div class="container-fluid">
    <div class="row wrapper">

      <aside id="side-panel" class="ps-4 pt-4 pb-4">
        <div>
          <div>
            <button class="save-btn btn btn-primary d-block">Save route</button>
          </div>
        </div>

        <hr>

         <div>
          <div class="d-flex align-items-center">
            <label class="mb-0 me-2" for="speed-input">Set speed: </label>
            <input v-model="shipSpeed" name="speed-input" id="speed-input" type="number" class="text-primary btn-secondary-outline d-block"/> kts
            <button @click="updateSpeeds" class=" animated-button btn ms-1"><i class=" icon-1 fa-solid fa-play"></i><i class=" icon-2 fa-solid fa-play"></i><i class=" icon-3 fa-solid fa-play"></i></button>
            <!-- <button @click="updateSpeeds" class="btn btn-outline-primary ms-1">&#8594;</button> -->
          </div>
        </div>

        <hr>

          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <button class=" sort-button btn btn-outline-secondary" @click="sortWPs">Sort <i :class="['fa-solid', 'fa-arrow-down',{ 'reverse-arrow': !sortedDescending }]"></i></button>
              <!-- <span :class="['sort-arrow', 'fs-3', 'ms-1',{ 'reverse-arrow': !sortedDescending } ]">&#8595;</span> -->
            </div>

            <div>
              <div class="btn border border-primary rounded" @click="centerOnActive">Active: <span class="fw-bold text-primary">{{activeWP?.name}}</span></div>
              <div @click="insertWp" :class="['btn', 'btn-warning',{'disabled': this.activeWP?.id === this.waypoints[this.waypoints.length-1]?.id}]">Insert</div>
              <div @click="removeWP(activeWP?.id)" class="btn btn-danger">Delete active</div>
            </div>
          </div>
        <hr>

        <div class="waypoint-container">
          <!-- waypoint list -->
          <WaypointCard :lastWp="waypoints[waypoints.length-1]" :activePoint="activeWP" v-for="(wp) in showSorted" :waypoint="wp" :key="wp.id" @card-clicked="handleCardClick(wp)"/>
        </div>
      </aside>

      <div id="map-wrap" >
        <client-only>
          <l-map :zoom="zoom" :center="center" @click="handleMapClick">
            <l-tile-layer :url="url"></l-tile-layer>
            <!-- <l-image-overlay :url="overlayUrl" :bounds="bounds"></l-image-overlay> -->
            <l-marker v-for="(wp) in waypoints" :lat-lng="[wp.lat,wp.lng]" @click="markerClick(wp.id)" :key="wp.id" :icon="selectMarkerIcon()" >
              <l-popup> 
                <p class="p-0 m-0 fw-bold">WP{{wp.name}}</p> 
                <p class="p-0 m-0">Course: {{wp.nextCourse != 'N/A'? Math.floor(wp.nextCourse)+'°':'N/A'}}</p>
                <p class="p-0 m-0">Distance: {{ wp.wpToWp != 'N/A'? wp.wpToWp.toFixed(2) + ' NM':'N/A'}}</p>
                <p class="p-0 m-0">Speed: {{wp.id != waypoints[waypoints.length-1].id ? wp.speed + ' kts':'N/A'}}</p>
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
      url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png',
      // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      // overlayUrl: 'http://tiles.openseamap.org/seamark/${z}/${x}/${y}.png',
      // bounds: [[45.5727, 12.9830], [44.924946, 12.363739]],
      marker: [45.08397548484512, 13.633303642272951],
      waypoints: [],
      sortedDescending: true,
      activeWP: {id:0},
      shipSpeed: 7,
      totalDistance: 0,
      totalTimeHrs:0,
    }
  },
  watch:{
    shipSpeed(){
      this.getTotalTime();
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
    },

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
    selectMarkerIcon(){
      let url = '';
      if(this.waypoints.length === 1 ){
        url = '/_nuxt/assets/img/icons/test.png';
      }else if(this.waypoints.length > 1){
        url = '/_nuxt/assets/img/icons/start.png';
      }
      // ipak će morati postojati odvojeni elementi markera za svaku od ikona...
      return  L.icon({
                iconUrl: url,
                iconSize: [41, 41],
                iconAnchor: [20, 20],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
              })
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
      // ako postoji aktivni waypoint
      if(this.activeWP?.id){
      
      // dodavanjem ovog deviationa postize se promjena stanja u varijabli center kako bi se retriggeralo centriranje mape svakim pritiskom na gumb koji poziva ovu funkciju 
      // u suprotnom, ako nema promjene, neće doći ni do centriranja. Budući da se pogled mape može promjeniti bez da se promjeni aktivni WP stoga je ovaj workaround za to stanje.
        const DEVIATION = 0.0001;
        if(this.center[0] == this.activeWP.lat){
          this.center = [this.activeWP.lat + DEVIATION,this.activeWP.lng + DEVIATION];
        }else{
          this.center = [this.activeWP.lat,this.activeWP.lng];
        }
      }
    },
    sortWPs(){
      this.sortedDescending = !this.sortedDescending;
    },
    insertWp(){
      // ubaci ga između njega i sljedećeg (ako postoji)
      const afterActiveWpIndex = this.waypoints.findIndex(wp=>wp.id === this.activeWP.id) + 1;
      //ako postoji idući nakon aktivnog
      const afterActive = this.waypoints[afterActiveWpIndex];
      if(!afterActive) return;

      // dobivanje međukoordinate i kreiranje wp-a
      const [midLat,midLng] = this.getMidpoint(this.activeWP,afterActive);
      let datum = new Date;
      const newWaypoint = {
        id: Date.now(),
        name: 0,
        lat: midLat,
        lng: midLng,
        nextCourse: 'N/A',
        wpToWp: 'N/A',
        speed: this.shipSpeed,
        timeCreated: `${datum.getFullYear()}-${String(datum.getMonth()+1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')} ${String(datum.getHours()).padStart(2, '0')}:${String(datum.getMinutes()).padStart(2, '0')}:${String(datum.getSeconds()).padStart(2, '0')}`
      };

      // ubaci ga na pripradajuće mjesto
      let waypointsCopy = [...this.waypoints];
      waypointsCopy.splice(afterActiveWpIndex, 0, newWaypoint);
      this.waypoints = waypointsCopy;

      this.updateNames();

      const updatedNewWPindex = this.waypoints.findIndex(wp=>wp.id === newWaypoint.id);
      // postavi ga kao aktivnog
      this.setActiveWP(this.waypoints[updatedNewWPindex])
      this.centerOnActive();

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
          speed: this.shipSpeed,
          timeCreated: `${datum.getFullYear()}-${String(datum.getMonth()+1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')} ${String(datum.getHours()).padStart(2, '0')}:${String(datum.getMinutes()).padStart(2, '0')}:${String(datum.getSeconds()).padStart(2, '0')}`
        };
        // ubaci novi waypoint u waypoints array na nacin:

        // ako je waypoints array prazan ubaci na zadnje mjesto
        // ako je zadnji waypoint === aktivni ubaci na zadnje mjesto
        
        if(!this.waypoints.length || this.waypoints[this.waypoints.length-1].id === this.activeWP.id){
          this.waypoints = [...this.waypoints,newWaypoint];
        // ako je neki drugi waypoint aktivan zamjeni ga u arrayu sa ovim novim ili ga dodaj između njega i sljedećeg (insertWp)
        }else{
          this.waypoints = this.waypoints.map(wp=>{
            if(wp.id === this.activeWP.id) return newWaypoint
            else return wp;
          })
        }

        // podesi imena (ako imamo wp1,wp2,wp3 i obrisemo wp2, potrebno je svima podesiti imena tako da se wp3 sada zove wp2)
        this.updateNames();
        // pronadi index tog waypointa (nakon sto su sva imena updejtana)
        const updatedNewWPindex = this.waypoints.findIndex(wp=>wp.id === newWaypoint.id);
        // postavi ga kao aktivnog
        this.setActiveWP(this.waypoints[updatedNewWPindex])       
      }
    },
    removeWP(id){
      if(id){
        const activeWPIndex = this.waypoints.findIndex(wp=>wp.id === this.activeWP.id);
        // izbaci ga iz waypoints liste
       
        this.waypoints = this.waypoints.filter(wp=>wp.id !== id)
        this.updateNames();
        // ako je obrisani wp bio ujedno i aktivan stavi da novi aktivni bude onaj prije njega (ako postoji)
        if(this.activeWP.id === id){
          const prevWP = this.waypoints[activeWPIndex -1];
          if(prevWP){
            this.setActiveWP(prevWP);
          }else {
            this.setActiveWP(this.waypoints[this.waypoints.length-1]);
          }
        }
      }
    }, 
    updateSpeeds(){
      // pronadji indeks aktivnog waypointa
      const activeIndex = this.waypoints.findIndex(wp=>wp.id === this.activeWP.id)
      // updejtaj speed za sve waypointove od aktivnog pa do kraja arraya
      let updatedArray = [...this.waypoints];
      for (let i = activeIndex; i < updatedArray.length; i++) {
        updatedArray[i].speed = this.shipSpeed;
      }
      this.waypoints = updatedArray;
      this.getTotalTime();
    },
    calculateCourse(wp1,wp2) {
      let dLon = (wp2.lng - wp1.lng);
      let y = Math.sin(dLon) * Math.cos(wp2.lat);
      let x = Math.cos(wp1.lat) * Math.sin(wp2.lat) - Math.sin(wp1.lat) * Math.cos(wp2.lat) * Math.cos(dLon);
      let brng = Math.atan2(y, x) * 180 / Math.PI;
      return (brng + 360) % 360;
    },
    getMidpoint(wp1, wp2) {
      // Extract the x and y values from the coordinates
      const x1 = wp1.lat;
      const y1 = wp1.lng;
      const x2 = wp2.lat;
      const y2 = wp2.lng;

      // Calculate the midpoint x and y values
      const midpointX = (x1 + x2) / 2;
      const midpointY = (y1 + y2) / 2;

      // Return the midpoint coordinates as a new array
      return [midpointX, midpointY];
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
      if(this.waypoints.length>0){
        this.totalDistance = this.waypoints.reduce((acc,wp)=>{return wp.wpToWp != 'N/A'? acc + wp.wpToWp:acc+0},0);

      }else this.totalDistance =0;
    },
    getTotalTime(){
      if(this.waypoints.length<1) return;
      let eta = this.waypoints.map(wp=> wp.wpToWp != 'N/A'? wp.wpToWp/wp.speed : 0);
      this.totalTimeHrs = eta.reduce((acc,time)=>acc+time);
    },
    formatTime(hours) {
      let dateObj = new Date(hours * 3600 * 1000); // convert hours to milliseconds
      let hoursFormatted = dateObj.getUTCHours().toString().padStart(2, '0'); // get hours and add leading zero if necessary
      let minutesFormatted = dateObj.getUTCMinutes().toString().padStart(2, '0'); // get minutes and add leading zero if necessary
      let secondsFormatted = dateObj.getUTCSeconds().toString().padStart(2, '0'); // get seconds and add leading zero if necessary
      return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`; // return formatted time string
    },
    calculateNavData(){
      if(this.waypoints.length > 0){
        let updatedWPs = [...this.waypoints];
        updatedWPs.forEach((wp,i)=>{
          if(this.waypoints[i+1]){
            wp.nextCourse = this.calculateCourse(wp,this.waypoints[i+1])
            wp.wpToWp = this.calculateDistance(wp,this.waypoints[i+1]);
          }
        })
        // zadnji waypoint u arrayu nikad nesmije imati definirane sljedece atribute!
        updatedWPs[updatedWPs.length-1].wpToWp = 'N/A';
        updatedWPs[updatedWPs.length-1].nextCourse = 'N/A';
        this.waypoints = updatedWPs;
        // updejtaj ukupnu udaljenost rute
        this.getTotalDistance();
        this.getTotalTime();
      }
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/main.css';
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
    height: calc(100vh - 280px);
    margin-bottom: 200px;
  }
  .save-btn {
    width: 100%;
  }
  .sort-button {
    transition: none;
  }
  .icon-1, .icon-2, .icon-3 {
    color: var(--primary-blue);
  }
  .reverse-arrow {
    transform: rotate(180deg);
  }
  .active {
    border: 1px solid var(--primary-blue);
  }
  #speed-input {
    max-width: 50px;
    margin-right: 8px;
    border: none;
    border-radius: 3px;
    text-align: center;
    padding-left: 11px;
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