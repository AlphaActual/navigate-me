<template>
    <div>
        <div :class="['card','mb-2','p-2',{'active-card':this.activePoint.id == waypoint.id}]" @click="$emit('card-clicked',waypoint)">
         <span class="fw-bold"> WP{{ waypoint.name }}</span>
         <p>
          <!-- ID: {{waypoint.id}} <br> -->
          Lat: {{ formatLatitude(waypoint.lat) }} <br>
          Long: {{ formatLongitude(waypoint.lng) }}<br>
          Next Course: {{ waypoint.nextCourse != 'N/A'? Math.floor(waypoint.nextCourse)+'°':'N/A'}} <br>
          To next Wp: {{ waypoint.wpToWp != 'N/A'? waypoint.wpToWp.toFixed(2) + ' NM':'N/A'}} <br>
          Created: {{ waypoint.timeCreated }}
         </p>
          <!-- <button class="delete-button btn btn-danger d-inline-block" @click="$emit('delete-WP-event',waypoint.id)">Delete</button> -->
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
    },
    activePoint: {
      type: Object,
      required: true
    }

  },
  methods: {
    formatLatitude(latitude) {
      let absolute = Math.abs(latitude); // Get absolute value of latitude
      let degrees = Math.floor(absolute); // Get whole degrees
      let minutes = Math.floor((absolute - degrees) * 60); // Get whole minutes
      let seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2); // Get seconds and round to 2 decimal places
      let direction = latitude >= 0 ? "N" : "S"; // Determine N or S
      
      // degrees = degrees.toString();
      // minutes = minutes.toString();
      // let degreesSetLen = 3;
      // let minutesSetLen = 2;

      // let numZeroesToAdd = degreesSetLen - degrees.length;
      // degrees = "0".repeat(numZeroesToAdd) + degrees;

      // numZeroesToAdd = minutesSetLen - minutes.length;
      // minutes = "0".repeat(numZeroesToAdd) + minutes;
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
      
      // dodavanje prefiksa nula na početak stupnjeva i minuta
      // 3° -> 003° itd.
      // degrees = degrees.toString();
      // minutes = minutes.toString();
      // let degreesSetLen = 3; 
      // let minutesSetLen = 2;

      // let numZeroesToAdd = degreesSetLen - degrees.length;
      // degrees = "0".repeat(numZeroesToAdd) + degrees;

      // numZeroesToAdd = minutesSetLen - minutes.length;
      // minutes = "0".repeat(numZeroesToAdd) + minutes;
      degrees = String(degrees).padStart(3, '0');
      minutes = String(minutes).padStart(2, '0');

      return degrees + "° " + minutes + "' " + seconds + "\" " + direction;
    }
  }
    
};

</script>

<style scoped>
  .card {
    cursor: pointer;
  }
  .card:hover{
    transform: scale(0.95);
  }
  .delete-button {
    width: 100px;
  }
</style>