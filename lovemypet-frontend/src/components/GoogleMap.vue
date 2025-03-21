<script setup>
import { ref, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchInput = ref(null);
const mapElement = ref(null);
const selectedLocation = ref(null);
const map = ref(null);
const marker = ref(null);

// Load Google Maps API
onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your actual API key
    libraries: ["places"],
  });

  const google = await loader.load();
  if (!mapElement.value || !searchInput.value) return;

  // Initialize Map
  map.value = new google.maps.Map(mapElement.value, {
    center: { lat: 40.7128, lng: -74.006 }, // Default location (New York City)
    zoom: 12,
  });

  // Initialize Autocomplete
  const autocomplete = new google.maps.places.Autocomplete(
    searchInput.value.$el
  );
  autocomplete.bindTo("bounds", map.value);

  // Handle place selection
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    selectedLocation.value = location;
    map.value.setCenter(location);

    // Set or update marker
    if (!marker.value) {
      marker.value = new google.maps.Marker({
        position: location,
        map: map.value,
        draggable: true,
      });

      // Allow user to drag marker and update location
      marker.value.addListener("dragend", (event) => {
        selectedLocation.value = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
      });
    } else {
      marker.value.setPosition(location);
    }
  });

  // Handle manual click on the map
  map.value.addListener("click", (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    selectedLocation.value = clickedLocation;

    if (!marker.value) {
      marker.value = new google.maps.Marker({
        position: clickedLocation,
        map: map.value,
        draggable: true,
      });

      marker.value.addListener("dragend", (event) => {
        selectedLocation.value = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
      });
    } else {
      marker.value.setPosition(clickedLocation);
    }
  });
});
</script>

<template>
  <div>
    <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label for="searchInput">Location</Label>
        </div>
        <!-- Search Input for Google Places Autocomplete -->
        <Input ref="searchInput" placeholder="Search location..." class="mb-4" />
    </div>

    <!-- Google Map Container -->
    <div ref="mapElement" class="map-container h-96 w-full"></div>

    <!-- Display Selected Coordinates -->
    <div v-if="selectedLocation" class="mt-2 text-gray-700">
      Selected Coordinates: {{ selectedLocation.lat }},
      {{ selectedLocation.lng }}
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
</style>
