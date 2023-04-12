<template>
  <div>
    <div :class="['card', 'mb-2', 'p-2', { 'active-card': this.activeRoute.id == route.id }]"
      @click="$emit('card-clicked', route)">
      <span class="fw-bold"> {{ route.name }}</span>
      <p>
        <span>
          Total distance: {{ route.distance }}
        </span>
        <span>
          Total duration: {{ route.duration }}
        </span>
      </p>
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

</style>