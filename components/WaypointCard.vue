<template>
    <div>
        <div class="card mb-2 p-2" @click="$emit('card-clicked',waypoint)">
          Name: WP{{ waypoint.name }} <br>
          ID: {{waypoint.id}} <br>
          Lat: {{ formatLatitude(waypoint.lat) }} <br>
          Long: {{ formatLongitude(waypoint.lng) }}<br>
          Created: {{ waypoint.timeCreated }}
          <button class="delete-button btn btn-danger d-inline-block" @click="$emit('delete-WP-event',waypoint.id)">Delete</button>
        </div>
    </div>
</template>
<script>

export default {
  name: 'WaypointCard',
  props: {  
    waypoint:{
        type: Object,
        required:true
    }

  },
  methods: {
    formatLatitude(latitude) {
      let absolute = Math.abs(latitude); // Get absolute value of latitude
      let degrees = Math.floor(absolute); // Get whole degrees
      let minutes = Math.floor((absolute - degrees) * 60); // Get whole minutes
      let seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2); // Get seconds and round to 2 decimal places
      let direction = latitude >= 0 ? "N" : "S"; // Determine N or S
      
      return degrees + "° " + minutes + "' " + seconds + "\" " + direction;
    },
    formatLongitude(longitude) {
      let absolute = Math.abs(longitude); // Get absolute value of longitude
      let degrees = Math.floor(absolute); // Get whole degrees
      let minutes = Math.floor((absolute - degrees) * 60); // Get whole minutes
      let seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2); // Get seconds and round to 2 decimal places
      let direction = longitude >= 0 ? "E" : "W"; // Determine E or W
      
      return degrees + "° " + minutes + "' " + seconds + "\" " + direction;
    }
  }
    
};

</script>

<style scoped>
   .delete-button {
    width: 100px;
   }
</style>