<template>
  <div>
    <div :tabindex="index" :class="['card', 'mb-2', 'p-2', { 'active-card': this.activeRoute.id == route.id }]"
      @click="$emit('card-clicked', route)">
      <span class="fw-bold"> {{ route.routeName }}</span>
      <p>
        <!-- ID: {{route.id}} <br> -->
        <table>
          <tr>
              <td class="pe-4">Duration</td>
              <td>{{ formatTime(route.totalTimeHrs) }} hrs</td>
          </tr>
          <tr>
              <td class="pe-4">Distance:</td>
              <td>{{ route.totalDistance.toFixed(2) }} NM</td>
          </tr>
          <tr>
              <td class="pe-4">No. of WPs:</td>
              <td>{{ route.waypoints.length }}</td>
          </tr>
          <tr>
              <td class="pe-4">Created:</td>
              <td>{{ route.timeCreated }}</td>
          </tr>
        </table>
      </p>
      <div class="card-options d-flex">
        <button class="btn btn-warning">Edit</button>
        <button class="btn btn-warning">Delete</button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'RouteCard',
  props: {
    route: {
      type: Object,
      required: true
    },
    activeRoute: {
      type: Object,
      required: true
    },
    index: {
      type:Number,
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
    formatTime(hours) {
      let dateObj = new Date(hours * 3600 * 1000); // convert hours to milliseconds
      let hoursFormatted = dateObj.getUTCHours().toString().padStart(2, '0'); // get hours and add leading zero if necessary
      let minutesFormatted = dateObj.getUTCMinutes().toString().padStart(2, '0'); // get minutes and add leading zero if necessary
      let secondsFormatted = dateObj.getUTCSeconds().toString().padStart(2, '0'); // get seconds and add leading zero if necessary
      return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`; // return formatted time string
    }
  }

};

</script>

<style scoped>
@import '~/assets/css/main.css';
.card {
  cursor: pointer;
  margin-right: 4px;
  background-color: var(--card-color);
}

.card:hover {
  transform: scale(0.95);
}

.card-options {
  transition: all 500ms ease-in-out;
  gap:8px;
  max-height: 0px;
  overflow: hidden;

}
.card:focus .card-options {
  max-height: 100px;
}
.card-options > * {
  width: 50%;
}
</style>