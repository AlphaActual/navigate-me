<template>
  <div>
    <div :class="['card', 'mb-2', 'p-2', { 'active-card': this.activePoint.id == waypoint.id }]"
      @click="$emit('card-clicked', waypoint)">
      <span class="fw-bold"> WP{{ waypoint.name }}</span>
      <p>
        <!-- ID: {{waypoint.id}} <br> -->
        <table>
          <tr>
              <td class="pe-4">Lat:</td>
              <td>{{ formatLatitude(waypoint.lat) }}</td>
          </tr>
          <tr>
              <td class="pe-4">Long:</td>
              <td>{{ formatLongitude(waypoint.lng) }}</td>
          </tr>
          <tr>
              <td class="pe-4">Next Course:</td>
              <td>{{ waypoint.nextCourse != 'N/A' ? Math.floor(waypoint.nextCourse) + '°' : 'N/A' }}</td>
          </tr>
          <tr>
              <td class="pe-4">To next Wp:</td>
              <td>{{ waypoint.wpToWp != 'N/A' ? waypoint.wpToWp.toFixed(2) + ' NM' : 'N/A' }}</td>
          </tr>
          <tr>
              <td class="pe-4">Speed to next Wp:</td>
              <td>{{ waypoint.id != lastWp.id ? waypoint.speed + ' kts' : 'N/A' }}</td>
          </tr>
          <tr>
              <td class="pe-4">Created:</td>
              <td>{{ waypoint.timeCreated }}</td>
          </tr>
        </table>
      </p>
      <!-- <button class="delete-button btn btn-danger d-inline-block" @click="$emit('delete-WP-event',waypoint.id)">Delete</button> -->
    </div>
  </div>
</template>
<script>

export default {
  name: 'WaypointCard',
  props: {
    waypoint: {
      type: Object,
      required: true
    },
    activePoint: {
      type: Object,
      required: true
    },
    lastWp: {
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

.delete-button {
  width: 100px;
}</style>