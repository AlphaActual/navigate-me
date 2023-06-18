<template>
  <div class="main-div">
    <Header back="/routes" pageTitle="Create/edit route" :totalD="totalDistance" :totalT="this.formatTime(this.totalTimeHrs)" @load-route="loadTutorialRoute" />
    <div class="container-fluid">
      <div class="row wrapper">

        <aside v-in-viewport id="side-panel" class="ps-4 pt-4 pb-4 slide-left">
          <!-- save row -->
          <div>
            <div id="save-row">
              <div class="d-flex">
                <button @click="saveToLocalStorage" class="save-btn btn d-flex justify-content-center mb-2" :disabled="isDisabled" id="save-btn">
                  <div>Save route</div>
                  <div v-show="showSpinner" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </button>
              </div>
              <input v-model="routeName" name="name-input" id="name-input" type="text" class="text-center btn-secondary-outline p-1 d-block"/>
            </div>
          </div>
          <!-- end of save row -->

          <hr>

          <!-- speed row -->
          <div>
            <div class="d-flex align-items-center">
              <label class="mb-0 me-2" for="speed-input">Set {{circleChecked ? 'radius':'speed'}}: </label>
              <input v-model="shipSpeed" name="speed-input" id="speed-input" type="number" min="0.1" step="0.1" required class="text-danger-main fw-bold btn-secondary-outline d-block"/> {{circleChecked ? 'NM':'kts'}}
              <button v-if="!circleChecked" id="update-speed-btn" @click="updateSpeeds" class=" animated-button btn ms-1"><i class=" icon-1 fa-solid fa-play"></i><i class=" icon-2 fa-solid fa-play"></i><i class=" icon-3 fa-solid fa-play"></i></button>
            </div>
          </div>
          <!-- end of speed row -->

          <hr>

          <!-- marker icons row -->
          <div class="icons-row d-flex justify-content-around align-items-center">
            
              <input type="radio" class="btn-check" name="options" id="option-waypoint" autocomplete="off" checked>
              <label @click="CircleChecked(false)" class="btn btn-warning" for="option-waypoint"><i class="fa-solid fa-location-dot"></i></label>

              <input type="radio" class="btn-check" name="options" id="option-circle" autocomplete="off">
              <label @click="CircleChecked(true)" class="btn btn-warning" for="option-circle"><i class="fa-regular fa-circle"></i></label>

              <input type="radio" class="btn-check" name="options" id="option-anchor" autocomplete="off">
              <label @click="CircleChecked(false)" class="btn btn-warning" for="option-anchor"><i class="fa-solid fa-anchor"></i></label>

              <input type="radio" class="btn-check" name="options" id="option-pin" autocomplete="off">
              <label @click="CircleChecked(false)" class="btn btn-warning" for="option-pin"><i class="fa-solid fa-map-pin"></i></label>

              <div class="marker-info">
                <input v-model="markerDescription" name="marker-in
                circleChecked: false,put" id="marker-input" type="text" class="btn-secondary-outline p-1 d-block"/>
              </div>

            
          </div>
          <!--end of marker icons row -->

          <hr>

          <!-- sort active insert delete row -->
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <button class=" sort-button btn btn-outline-secondary" @click="sortWPs">Sort <i :class="['fa-solid', 'fa-arrow-down',{ 'reverse-arrow': !sortedDescending }]"></i></button>
              <!-- <span :class="['sort-arrow', 'fs-3', 'ms-1',{ 'reverse-arrow': !sortedDescending } ]">&#8595;</span> -->
            </div>

            <div>
              <div class="active-wp btn rounded" @click="centerOnActive">Active: <span class="fw-bold text-danger-main">{{activeWP?.name}}</span></div>
              <div id="insert-btn" @click="insertWp" :class="['btn', 'btn-warning',{'disabled': this.activeWP?.id === this.waypoints[this.waypoints.length-1]?.id}]">Insert</div>
              <div @click="removeWP(activeWP?.id)" class="btn btn-danger" id="delete-active">Delete active</div>
            </div>
          </div>
          <!-- end of sort active insert delete row -->

          <hr>

          <!-- waypoint cards -->
          <div class="waypoint-container">
            <!-- waypoint list -->
            <WaypointCard v-in-viewport.once class="slide-left" :lastWp="waypoints[waypoints.length-1]" :activePoint="activeWP" v-for="(wp) in showSorted" :waypoint="wp" :key="wp.id" @card-clicked="handleCardClick(wp)"/>
          </div>
          <!-- end of waypoint cards -->
        </aside>

        <div id="map-wrap" >
          <button id="map-style-btn" class="btn change-map-style" @click="changeMapStyle"><i class="fa-solid fa-palette fa-lg"></i></button>
          <client-only>
            <!-- map -->
            <l-map :zoom="zoom" :center="center" @click="handleMapClick">
              <!-- tile layer -->
              <l-tile-layer :url="url"></l-tile-layer>
              
              <!-- waypoint markers -->
              <l-marker v-for="(wp,index) in waypoints" :lat-lng="[wp.lat,wp.lng]" @click="markerClick(wp.id)" :key="wp.id" :icon="index === 0 ? firstMarkerIcon : defaultMarkerIcon" >
                <l-popup> 
                  <p class="p-0 m-0 fw-bold">WP{{wp.name}}</p> 
                  <p class="p-0 m-0">Course: {{wp.nextCourse != 'N/A'? Math.floor(wp.nextCourse)+'°':'N/A'}}</p>
                  <p class="p-0 m-0">Distance: {{ wp.wpToWp != 'N/A'? wp.wpToWp.toFixed(2) + ' NM':'N/A'}}</p>
                  <p class="p-0 m-0">Speed: {{wp.id != waypoints[waypoints.length-1].id ? wp.speed + ' kts':'N/A'}}</p>
                  </l-popup>
              </l-marker>
              <!-- polylines -->
              <l-polyline :lat-lngs="getLinesCoordinates" ></l-polyline>

              <!-- circle markers -->
              <l-circle v-for="(circle) in circles" :key="circle.id" :lat-lng="[circle.lat, circle.lng]" :radius="circle.radius">
                <l-popup>
                  <p class="p-0 m-0 fw-bold">{{circle.description}}</p>
                  <p class="p-0 m-0">Radius: {{circle.radius/1852}} NM</p>
                  <button @click="removeCircle(circle.id)" class=" btn btn-outline-danger ps-2 pe-2 pt-0 pb-0">Delete</button>
                </l-popup>
              </l-circle>

              <!-- anchor markers -->
              <l-marker v-for="(anchor) in anchors" :key="anchor.id" :lat-lng="[anchor.lat, anchor.lng]" :icon="anchorMarkerIcon">
                <l-popup>
                  <p class="p-0 m-0 fw-bold">{{anchor.description}}</p>
                  <p class="p-0 m-0">Lat: {{formatLatitude(anchor.lat)}}</p>
                  <p class="p-0 m-0">Long: {{formatLongitude(anchor.lng)}}</p>
                  <button @click="removeAnchor(anchor.id)" class=" btn btn-outline-danger ps-2 pe-2 pt-0 pb-0">Delete</button>
                </l-popup>
              </l-marker>

              <!-- pin markers -->
              <l-marker v-for="(pin) in pins" :key="pin.id" :lat-lng="[pin.lat, pin.lng]" :icon="pinMarkerIcon">
                <l-popup>
                  <p class="p-0 m-0 fw-bold">{{pin.description}}</p>
                  <p class="p-0 m-0">Lat: {{formatLatitude(pin.lat)}}</p>
                  <p class="p-0 m-0">Long: {{formatLongitude(pin.lng)}}</p>
                  <button @click="removePin(pin.id)" class=" btn btn-outline-danger ps-2 pe-2 pt-0 pb-0">Delete</button>
                </l-popup>
              </l-marker>

            </l-map>
          </client-only>
          <div class="line line-vertical"></div>
          <div class="line line-horizontal"></div>
        </div>

      </div>
    </div>
    <Tutorial v-if="$store.state.tutorialVisible" :slides="this.$store.state.tutorialSlides1" />
  </div>
 
</template>

<script>
// za koristenje v-in-viewport
import Vue from 'vue'
import inViewportDirective from 'vue-in-viewport-directive'
Vue.directive('in-viewport', inViewportDirective)

export default {
  name: 'AddEditRoute',
  transition: 'fade',
  data() {
    return {
      showSpinner: false,
      routeId: null,
      routeName:'MyRoute',
      zoom: 15,
      center: [45.08397548484512, 13.633303642272951],
      url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png',
      // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      // overlayUrl: 'http://tiles.openseamap.org/seamark/${z}/${x}/${y}.png',
      // bounds: [[45.5727, 12.9830], [44.924946, 12.363739]],
      marker: [45.08397548484512, 13.633303642272951],
      waypoints: [],
      circles:[],
      anchors:[],
      pins:[],
      sortedDescending: true,
      activeWP: {id:0},
      shipSpeed: 7,
      totalDistance: 0,
      totalTimeHrs:0,
      markerDescription: 'MyMarkerName',
      circleChecked: false,
      firstMarkerIcon: L.icon({
                iconUrl: require('@/assets/img/icons/start.png'),
                iconSize: [41, 41],
                iconAnchor: [20, 20],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                }),
      defaultMarkerIcon: L.icon({
                iconUrl: require('@/assets/img/icons/default.png'),
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                }),
      anchorMarkerIcon: L.icon({
                iconUrl: require('@/assets/img/icons/anchor.svg'),
                iconSize: [41, 41],
                iconAnchor: [20, 20],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                }),
      pinMarkerIcon: L.icon({
                iconUrl: require('@/assets/img/icons/pin.svg'),
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                }),
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
    isDisabled(){
      return this.waypoints.length < 1 && this.circles.length < 1 && this.anchors.length < 1 && this.pins.length < 1;
    },
  },
  mounted(){
    this.loadEditRoute();
    this.loadMapStyle();
  },
  
  methods: {
    setActiveWP(wp){
      this.activeWP = wp;
    },
    CircleChecked(val){
      this.circleChecked = val;
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
        // ako je wp
        if(document.getElementById('option-waypoint').checked){
          this.setWaypoint(e);
        }

        // ako je circle
        else if(document.getElementById('option-circle').checked){
          this.setCircle(e);
        }
        // ako je anchor
        else if(document.getElementById('option-anchor').checked){
          this.setAnchor(e);
        }
        // ako je pin
        else if(document.getElementById('option-pin').checked){
          this.setPin(e);
        }
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
    setWaypoint(e){
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
    setCircle(e){
      let latitude = e.latlng.lat;
      let longitude = e.latlng.lng;
      let datum = new Date;
      
      const newCircle = {
        id: Date.now(),
        description: this.markerDescription,
        lat: latitude,
        lng: longitude,
        radius: this.shipSpeed * 1852, 
        timeCreated: `${datum.getFullYear()}-${String(datum.getMonth()+1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')} ${String(datum.getHours()).padStart(2, '0')}:${String(datum.getMinutes()).padStart(2, '0')}:${String(datum.getSeconds()).padStart(2, '0')}`
      };
      

      this.circles = [...this.circles,newCircle];
    },
    removeCircle(id){
      if(id){
        
        // izbaci ga iz circles liste
        this.circles = this.circles.filter(wp=>wp.id !== id)
      }
    },
    setAnchor(e){
      let latitude = e.latlng.lat;
      let longitude = e.latlng.lng;
      let datum = new Date;
      
      const newAnchor = {
        id: Date.now(),
        description: this.markerDescription,
        lat: latitude,
        lng: longitude,
        timeCreated: `${datum.getFullYear()}-${String(datum.getMonth()+1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')} ${String(datum.getHours()).padStart(2, '0')}:${String(datum.getMinutes()).padStart(2, '0')}:${String(datum.getSeconds()).padStart(2, '0')}`
      };
      

      this.anchors = [...this.anchors,newAnchor];
    },
    removeAnchor(id){
      if(id){
        
        // izbaci ga iz anchors liste
        this.anchors = this.anchors.filter(wp=>wp.id !== id)
      }
    },
    setPin(e){
      let latitude = e.latlng.lat;
      let longitude = e.latlng.lng;
      let datum = new Date;
      
      const newPin = {
        id: Date.now(),
        description: this.markerDescription,
        lat: latitude,
        lng: longitude,
        timeCreated: `${datum.getFullYear()}-${String(datum.getMonth()+1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')} ${String(datum.getHours()).padStart(2, '0')}:${String(datum.getMinutes()).padStart(2, '0')}:${String(datum.getSeconds()).padStart(2, '0')}`
      };
      

      this.pins = [...this.pins,newPin];
    },
    removePin(id){
      if(id){
        
        // izbaci ga iz pins liste
        this.pins = this.pins.filter(wp=>wp.id !== id)
      }
    },
    updateSpeeds(){
      if(this.waypoints.length < 1) return;
      // pronadji indeks aktivnog waypointa
      const activeIndex = this.waypoints.findIndex(wp=>wp.id === this.activeWP.id)
      let updatedArray = [...this.waypoints];
      // updejtaj speed aktivnog waypointa
      updatedArray[activeIndex].speed = this.shipSpeed;
      this.waypoints = updatedArray;
      this.getTotalTime();
    },
    calculateCourse(wp1,wp2) {
      let dLon = (wp2.lng - wp1.lng); 
      let dLat = (wp2.lat - wp1.lat); 
      let course = Math.atan2(dLon, dLat) * 180 / Math.PI; 
      return (course + 360) % 360;
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
    },
    formatLatitude(latitude) {
      let absolute = Math.abs(latitude); // Get absolute value of latitude
      let degrees = Math.floor(absolute); // Get whole degrees
      let minutes = Math.floor((absolute - degrees) * 60); // Get whole minutes
      let seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2); // Get seconds and round to 2 decimal places
      let direction = latitude >= 0 ? "N" : "S"; // Determine N or S

      degrees = String(degrees).padStart(3, '0');
      minutes = String(minutes).padStart(2, '0');

      return degrees + "° " + minutes + "' " + seconds + "\" " + direction;
    },
    formatLongitude(longitude) {
      let absolute = Math.abs(longitude); // Get absolute value of longitude
      let degrees = Math.floor(absolute); // Get whole degrees
      let minutes = Math.floor((absolute - degrees) * 60); // Get whole minutes
      let seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2); // Get seconds and round to 2 decimal places
      let direction = longitude >= 0 ? "E" : "W"; // Determine E or W

      degrees = String(degrees).padStart(3, '0');
      minutes = String(minutes).padStart(2, '0');

      return degrees + "° " + minutes + "' " + seconds + "\" " + direction;
    },
    saveToLocalStorage() {
      this.showSpinner = true;
      try {
        const retrievedRoutes = JSON.parse(localStorage.getItem('routesArray'));
        const datum = new Date;
        const newRoute = {
            "routeID": this.routeID || Date.now(),
            "routeName": this.routeName || 'MyRoute',
            "zoom": this.zoom,
            "center": this.center,
            "marker": this.marker,
            "waypoints": this.waypoints,
            "circles": this.circles,
            "anchors": this.anchors,
            "pins": this.pins,
            "sortedDescending": this.sortedDescending,
            "activeWP": this.activeWP,
            "shipSpeed": this.shipSpeed,
            "totalDistance": this.totalDistance,
            "totalTimeHrs": this.totalTimeHrs,
            "markerDescription": this.markerDescription,
            "circleChecked": this.circleChecked,
            "timeCreated": `${datum.getFullYear()}-${String(datum.getMonth()+1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')} ${String(datum.getHours()).padStart(2, '0')}:${String(datum.getMinutes()).padStart(2, '0')}:${String(datum.getSeconds()).padStart(2, '0')}`

        }
        let updatedRoutes;
        if(retrievedRoutes){
           updatedRoutes = [newRoute,...retrievedRoutes]
        } else {
          updatedRoutes = [newRoute]
        }
        localStorage.setItem('routesArray', JSON.stringify(updatedRoutes));

      } catch (e) {
        console.error('Error saving to local storage:', e);
      }
      this.$store.commit('setTutorialVisibility',false);
      setTimeout(() => {
        this.$router.push('/routes');
      }, 2000);
    },
    loadEditRoute(){
      const routeToLoad = JSON.parse(localStorage.getItem('editRoute'));
      if(!routeToLoad) return;

      this.routeId = routeToLoad.routeID;
      this.routeName = routeToLoad.routeName;
      this.zoom = routeToLoad.zoom;
      this.center = routeToLoad.center;
      this.marker = routeToLoad.marker;
      this.waypoints = routeToLoad.waypoints;
      this.circles = routeToLoad.circles;
      this.anchors = routeToLoad.anchors;
      this.pins = routeToLoad.pins;
      this.sortedDescending = routeToLoad.sortedDescending;
      this.activeWP = routeToLoad.activeWP;
      this.shipSpeed = routeToLoad.shipSpeed;
      this.totalDistance = routeToLoad.totalDistance;
      this.totalTimeHrs = routeToLoad.totalTimeHrs;
      this.markerDescription = routeToLoad.markerDescription;
      this.circleChecked = routeToLoad.circleChecked;

      localStorage.setItem('editRoute', JSON.stringify(null));

    },
    loadTutorialRoute(){
      // ako je neka ruta već unesena, ne učitavaj tutorial rutu
      if(this.waypoints.length > 1) {
        this.centerOnActive();
        return;
      };
      const tutorialRoute = `{
        "routeID": 1687082408571,
        "routeName": "Tutorial:  Rovinj - Crveni otok",
        "zoom": 15,
        "center": [
            45.06013860266919,
            13.62431287765503
        ],
        "marker": [
            45.08397548484512,
            13.633303642272951
        ],
        "waypoints": [
            {
                "id": 1687082282570,
                "name": 0,
                "lat": 45.08108922052623,
                "lng": 13.63458037376404,
                "nextCourse": 174.6482483821179,
                "wpToWp": 0.11715338191227812,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:02"
            },
            {
                "id": 1687082285640,
                "name": 1,
                "lat": 45.079142235470854,
                "lng": 13.634762763977053,
                "nextCourse": 199.59023156313935,
                "wpToWp": 0.08958152258096556,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:05"
            },
            {
                "id": 1687082286692,
                "name": 2,
                "lat": 45.077695211383016,
                "lng": 13.634247779846193,
                "nextCourse": 243.28674081552543,
                "wpToWp": 0.14578691950598158,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:06"
            },
            {
                "id": 1687082287850,
                "name": 3,
                "lat": 45.07628603228804,
                "lng": 13.631447553634645,
                "nextCourse": 238.07298721887153,
                "wpToWp": 0.21657716980294373,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:07"
            },
            {
                "id": 1687082290864,
                "name": 4,
                "lat": 45.07389944004184,
                "lng": 13.627617359161379,
                "nextCourse": 231.61291160311748,
                "wpToWp": 0.2132987318102703,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:10"
            },
            {
                "id": 1687082291879,
                "name": 5,
                "lat": 45.071247553980406,
                "lng": 13.624269962310791,
                "nextCourse": 217.69358807637187,
                "wpToWp": 0.3399942040670924,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:11"
            },
            {
                "id": 1687082293881,
                "name": 6,
                "lat": 45.06627683036563,
                "lng": 13.620429039001465,
                "nextCourse": 202.68959871978976,
                "wpToWp": 0.1413705759480134,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:13"
            },
            {
                "id": 1687082297666,
                "name": 7,
                "lat": 45.064018645449636,
                "lng": 13.619484901428224,
                "nextCourse": 161.2961679542591,
                "wpToWp": 0.08607841149619887,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:17"
            },
            {
                "id": 1687082299593,
                "name": 8,
                "lat": 45.06262428538732,
                "lng": 13.619956970214846,
                "nextCourse": 124.63071369907357,
                "wpToWp": 0.11454444573187138,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:19"
            },
            {
                "id": 1687082300371,
                "name": 9,
                "lat": 45.06129051785286,
                "lng": 13.621888160705568,
                "nextCourse": 115.41108490925421,
                "wpToWp": 0.12392658375414065,
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:20"
            },
            {
                "id": 1687082301847,
                "name": 10,
                "lat": 45.06013860266919,
                "lng": 13.62431287765503,
                "nextCourse": "N/A",
                "wpToWp": "N/A",
                "speed": 7,
                "timeCreated": "2023-06-18 11:58:21"
            }
        ],
        "circles": [],
        "anchors": [],
        "pins": [],
        "sortedDescending": true,
        "activeWP": {
            "id": 1687082301847,
            "name": 10,
            "lat": 45.06013860266919,
            "lng": 13.62431287765503,
            "nextCourse": "N/A",
            "wpToWp": "N/A",
            "speed": 7,
            "timeCreated": "2023-06-18 11:58:21"
        },
        "shipSpeed": 7,
        "totalDistance": 1.5883119466097557,
        "totalTimeHrs": 0.22690170665853657,
        "markerDescription": "MyMarkerName",
        "circleChecked": false,
        "timeCreated": "2023-06-18 12:00:08"
    }`
      localStorage.setItem('editRoute', tutorialRoute);
      this.loadEditRoute();
    },
    changeMapStyle(){
      if(this.url === 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png'){
        this.url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        localStorage.setItem('mapStyle', JSON.stringify(this.url));
      }else {
        this.url = 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png';
        localStorage.setItem('mapStyle', JSON.stringify(this.url));
      }
    },
    loadMapStyle(){
      const mapStyle = JSON.parse(localStorage.getItem('mapStyle'));
      if(mapStyle){
        this.url = mapStyle;
      }
    },
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
    position: relative;
  }

  .line {
    height: 1px;
    width: 100%;
    background-color: black;
    border-bottom:1px solid black;
    z-index: 400;
    position: absolute;
    top:50%;
    border-color: var(--ui-color);
  }
  .line-vertical{
    transform: rotate(90deg);
    left: -0px;
  }
  #side-panel{
    height: 100%;
    /* overflow-y: scroll; */
  }
  .icons-row .btn {
    margin-bottom:0;
    margin-right: 4px;
  }
  .icons-row input:checked + label {
    background-color: var(--brown-main);
    color: var(--warning-main);
  }
 
  .marker-info{
    width: 100%;
    padding-left: 14px;
  }
  #marker-input {
    width: 100%;
  }
  .waypoint-container {
    overflow: auto;
    height: calc(100vh - 400px);
  }
  .save-btn {
    width: 100%;
    background-color: var(--warning-main);
    transition: all 300ms ease;
  }
  .save-btn:hover {
    opacity: 0.8;
  }
  .sort-button {
    transition: none;
  }
  .icon-1, .icon-2, .icon-3 {
    color: var(--danger-main);
  }
  .reverse-arrow {
    transform: rotate(180deg);
  }
  .active {
    border: 1px solid var(--brown-main);
  }
  .active-wp {
    border: 1px solid var(--brown-main);
  }
  #speed-input {
    max-width: 50px;
    margin-right: 8px;
    border: none;
    border-radius: 3px;
    text-align: center;
    padding-left: 11px;
  }
  #name-input {
    width: 100%;
    border:1px solid gray;
    border-radius:3px;
  }
  .change-map-style {
    position: absolute;
    bottom: 10px;
    left: 15px;
    z-index: 1000;
    width: max-content;
  }

  @media(max-width: 768px){
    #side-panel,#map-wrap {
      height: 50vh;
    }
    body,.wrapper {
      overflow: auto;
    }
  }
  #map-wrap :hover {
  cursor: crosshair;
}
</style>