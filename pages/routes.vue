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
        <nuxt-link to="/add-edit-route">
          <div class="add-new-route btn btn-warning">
              Add new route
          </div>
        </nuxt-link>
        <hr>
        <p class="text-center">Available routes</p>
        <hr>

        <!-- route cards -->
        <div class="route-container">
          <!-- route list -->
          <RouteCard v-in-viewport.once class="slide-left"  :activeRoute="activeR" v-for="(routeData,i) in searchResults" :route="routeData" :index="i" :key="routeData.id" @card-clicked="handleCardClick(routeData)" @delete-route="openModal" @edit-route="editRoute"/>
        </div>
        <!-- end of route cards -->
      </aside>

      <div id="map-wrap" >
        <button class="btn change-map-style" @click="changeMapStyle"><i class="fa-solid fa-palette fa-lg"></i></button>
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
              </l-popup>
            </l-circle>

            <!-- anchor markers -->
            <l-marker v-for="(anchor) in anchors" :key="anchor.id" :lat-lng="[anchor.lat, anchor.lng]" :icon="anchorMarkerIcon">
              <l-popup>
                <p class="p-0 m-0 fw-bold">{{anchor.description}}</p>
                <p class="p-0 m-0">Lat: {{formatLatitude(anchor.lat)}}</p>
                <p class="p-0 m-0">Long: {{formatLongitude(anchor.lng)}}</p>
              </l-popup>
            </l-marker>

            <!-- pin markers -->
            <l-marker v-for="(pin) in pins" :key="pin.id" :lat-lng="[pin.lat, pin.lng]" :icon="pinMarkerIcon">
              <l-popup>
                <p class="p-0 m-0 fw-bold">{{pin.description}}</p>
                <p class="p-0 m-0">Lat: {{formatLatitude(pin.lat)}}</p>
                <p class="p-0 m-0">Long: {{formatLongitude(pin.lng)}}</p>
              </l-popup>
            </l-marker>

          </l-map>
        </client-only>
        <div class="line line-vertical"></div>
        <div class="line line-horizontal"></div>
      </div>

    </div>
  </div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Route deletion</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this route?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">NO</button>
            <button @click="deleteRoute" type="button" data-bs-dismiss="modal" class="btn btn-danger">YES</button>
          </div>
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
  transition: 'fade',
  data() {
    return {
      routeToDelete: null,
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
      this.setActiveRoute(this.routes[0])
      this.loadMapStyle();
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
    handleCardClick(route){
      this.setActiveRoute(route)
    },
    setActiveRoute(route){
      if(!route) return;
      this.activeR = route;
      this.loadRoute(route);
      this.showBoundArea();
    },
    loadRoute(route){
      this.routeName = route.routeName;
      this.zoom = route.zoom;
      this.center = route.center;
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

      const DEVIATION = 0.0001;
      let [lat, lng] = route.center;
      if(this.center === route.center){
        this.center = [lat + DEVIATION, lng + DEVIATION];
      }
    },
    showBoundArea(){
      const latitudes = [...this.waypoints,...this.circles,...this.anchors,...this.pins].map(w => {return w.lat})
      const longitudes = [...this.waypoints,...this.circles,...this.anchors,...this.pins].map(w => {return w.lng})
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
    
    formatTime(hours) {
      let dateObj = new Date(hours * 3600 * 1000); // convert hours to milliseconds
      let hoursFormatted = dateObj.getUTCHours().toString().padStart(2, '0'); // get hours and add leading zero if necessary
      let minutesFormatted = dateObj.getUTCMinutes().toString().padStart(2, '0'); // get minutes and add leading zero if necessary
      let secondsFormatted = dateObj.getUTCSeconds().toString().padStart(2, '0'); // get seconds and add leading zero if necessary
      return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`; // return formatted time string
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
    loadRoutes(){
      const routes = JSON.parse(localStorage.getItem('routesArray'));
      if(routes){
        this.routes = routes;
      }
    },
    openModal(route){
      this.routeToDelete = route;
      var myModal = new bootstrap.Modal(document.getElementById('exampleModal'))
      myModal.show();
    },
    deleteRoute(){
      
      this.routes = this.routes.filter(route=>route.routeID !== this.routeToDelete.routeID);
      
      localStorage.setItem('routesArray', JSON.stringify(this.routes));
      this.clearRouteData(this.routeToDelete);
      this.setActiveRoute(this.routes[0]);
      this.routeToDelete = null;
      
    },
    clearRouteData(route){
      this.routeName = '';
      this.zoom = 13;
      this.marker = route.marker;
      this.waypoints = [];
      this.circles = [];
      this.anchors = [];
      this.pins = [];
      this.sortedDescending = false;
      this.totalDistance = 0;
      this.totalTimeHrs = 0;
      this.markerDescription = '';
      this.circleChecked = false;
      this.timeCreated = '';
    },
    editRoute(route){
      localStorage.setItem('editRoute', JSON.stringify(route));
      this.$router.push('/add-edit-route');
    },
    changeMapStyle(){
      if(this.url === 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png'){
        this.url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      }else {
        this.url = 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png';
      }
      localStorage.setItem('mapStyle', JSON.stringify(this.url));
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
  .add-new-route {
    width: 100%;
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
</style>