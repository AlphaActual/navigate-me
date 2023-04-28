<template>
  <div class="main-div">
     <Header pageTitle="Available routes" :totalD="totalDistance" :totalT="this.formatTime(this.totalTimeHrs)" />
  <div class="container-fluid">
    <div class="row wrapper">

      <aside v-in-viewport id="side-panel" class="ps-4 pt-4 pb-4 slide-left">
        <!-- search row -->
        <div>
          <div>
            <label for="route-search">Search routes</label>
            <input v-model="searchTerm" name="route-search" id="route-search" type="text" class="btn-secondary-outline p-1 d-block" placeholder="Search term"/>
          </div>
        </div>
        <!-- end of search row -->
        <hr>
        <button>
          <nuxt-link to="/add-edit-route">
            Add new route +
          </nuxt-link>
        </button>
        <button @click="showWholeRoute">Show all</button>
        <hr>
        <p class="text-center">Available routes</p>
        <hr>

        <!-- route cards -->
        <div class="route-container">
          <!-- route list -->
          <RouteCard v-in-viewport.once class="slide-left"  :activeRoute="activeR" v-for="(routeData,i) in searchResults" :route="routeData" :index="i" :key="routeData.id" @card-clicked="handleCardClick(routeData)"/>
        </div>
        <!-- end of route cards -->
      </aside>

      <div id="map-wrap" >
        <client-only>
          <!-- map -->
          <l-map :zoom="zoom" :center="center" :bounds="mapBounds">
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
  </div>
 
</template>

<script>
// za koristenje v-in-viewport
import Vue from 'vue'
import inViewportDirective from 'vue-in-viewport-directive'
Vue.directive('in-viewport', inViewportDirective)

export default {
  name: 'Routes',
  data() {
    return {
      searchTerm: '',
      routeName:'My route',
      zoom: 15,
      mapBounds: null,
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
      activeR: {id:0},
      // shipSpeed: 7,
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
      routes: []
    }
  },
  watch:{
    shipSpeed(){
      this.getTotalTime();
    }
  },
  mounted() {
      this.loadRoutes();
  },
  computed: {
    searchResults(){
      if(this.searchTerm === '') return this.routes;
      return [...this.routes].filter(route=>route.routeName.toLowerCase().includes(this.searchTerm.toLowerCase()));
    },
    getLinesCoordinates(){
      return [this.waypoints.map(wp=>[wp.lat,wp.lng])];
    },

  },
  
  methods: {
    setActiveRoute(route){
      this.activeR = route;
      this.loadRoute(route);
      this.showBoundArea();
    },
    loadRoute(route){
      this.routeName = route.routeName;
      this.zoom = route.zoom;
      this.center = route.center;
      this.url = route.url;
      this.marker = route.marker;
      this.waypoints = route.waypoints;
      this.circles = route.circles;
      this.anchors = route.anchors;
      this.pins = route.pins;
      this.sortedDescending = route.sortedDescending;
      this.activeR = route;
      this.totalDistance = route.totalDistance;
      this.totalTimeHrs = route.totalTimeHrs;
      this.markerDescription = route.markerDescription;
      this.circleChecked = route.circleChecked;
      this.timeCreated = route.timeCreated;
    },
    showBoundArea(){
      const latitudes = this.waypoints.map(w => {return w.lat})
      const longitudes = this.waypoints.map(w => {return w.lng})
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLong = Math.min(...longitudes);
      const maxLong= Math.max(...longitudes);
      const corner1 = this.$L.latLng(maxLat, minLong);
      const corner2 = this.$L.latLng(minLat, maxLong);
      this.mapBounds = this.$L.latLngBounds(corner1, corner2);
    },
    CircleChecked(val){
      this.circleChecked = val;
    },
    markerClick(id){
      const updatedNewWPindex = this.waypoints.findIndex(wp=>wp.id === id);
      const selectedWP = this.waypoints[updatedNewWPindex];
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
    handleCardClick(route){
      this.setActiveRoute(route)
      // this.center = [wp.lat,wp.lng];
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
    showWholeRoute(){
      // work in progress
      //L.panInside([this.waypoints.map(wp=>[wp.lat,wp.lng])]);
    },
    loadRoutes(){
      const routes = JSON.parse(localStorage.getItem('routesArray'));
      if(routes){
        this.routes = routes;
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
  .route-container {
    overflow: auto;
    height: calc(100vh - 280px);
    margin-bottom: 200px;
  }
  .save-btn {
    width: 100%;
    color: white;
    background-color: var(--brown-main);
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
  #route-search {
    width: 100%;
    border:1px solid gray;
    border-radius:3px;
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