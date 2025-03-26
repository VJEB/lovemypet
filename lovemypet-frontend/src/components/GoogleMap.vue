<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const emit = defineEmits(["updateLocation"]);
const searchInput = ref(null);
const mapElement = ref(null);
const selectedLocation = ref(null);
const map = ref(null);
const marker = ref(null);
const locationType = ref('Point'); // Definir el tipo de ubicación dinámico

// Load Google Maps API
onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const google = await loader.load();
  if (!mapElement.value || !searchInput.value) return;

  // Initialize Map
  map.value = new google.maps.Map(mapElement.value, {
    center: { lat: 40.7128, lng: -74.0060 }, // Default location (New York City)
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

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    // Verifica que las coordenadas sean válidas
    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid coordinates:", lat, lng);
      return;
    }

    const location = {
      type: locationType.value,
      coordinates: [lat, lng],
    };

    selectedLocation.value = location;
    map.value.setCenter(location.coordinates);

    // Emitir ubicación al componente padre
    emit("updateLocation", location);

    // Establecer o actualizar el marcador
    if (!marker.value) {
      marker.value = new google.maps.Marker({
        position: { lat, lng },
        map: map.value,
        draggable: true,
      });

      // Permitir arrastrar el marcador y actualizar la ubicación
      marker.value.addListener("dragend", (event) => {
        const newLatLng = event.latLng;
        const newLocation = {
          type: locationType.value,
          coordinates: [newLatLng.lat(), newLatLng.lng()],
        };
        selectedLocation.value = newLocation;
        emit("updateLocation", selectedLocation.value); // Emitir nueva ubicación
      });
    } else {
      marker.value.setPosition({ lat, lng });
    }
  });

  // Manejar clic manual en el mapa
  map.value.addListener("click", (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Verifica que las coordenadas sean válidas
    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid coordinates on click:", lat, lng);
      return;
    }

    const clickedLocation = {
      type: locationType.value,
      coordinates: [lat, lng],
    };

    selectedLocation.value = clickedLocation;
    emit("updateLocation", clickedLocation); // Emitir ubicación clickeada

    if (!marker.value) {
      marker.value = new google.maps.Marker({
        position: { lat, lng },
        map: map.value,
        draggable: true,
      });

      marker.value.addListener("dragend", (event) => {
        const newLatLng = event.latLng;
        const updatedLocation = {
          type: locationType.value,
          coordinates: [newLatLng.lat(), newLatLng.lng()],
        };
        selectedLocation.value = updatedLocation;
        emit("updateLocation", selectedLocation.value);
      });
    } else {
      marker.value.setPosition({ lat, lng });
    }
  });
});
</script>



<template>
  <div>
    <div class="space-y-2">
      <!-- Search Input for Google Places Autocomplete -->
      <Input ref="searchInput" placeholder="Search location..." class="mb-4" />
    </div>

    <!-- Google Map Container -->
    <div ref="mapElement" class="map-container h-96 w-full"></div>
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