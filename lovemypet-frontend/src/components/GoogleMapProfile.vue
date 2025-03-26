<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const emit = defineEmits(["updateLocation"]); // Emite el evento con la nueva ubicación

const searchInput = ref(null);  // Referencia para el input de búsqueda
const mapElement = ref(null);   // Referencia para el contenedor del mapa
const selectedLocation = ref(null);  // Ubicación seleccionada
const map = ref(null);  // Mapa de Google
const marker = ref(null);  // Marcador en el mapa

// Establecer el tipo de ubicación a "Point" por defecto
const locationType = ref('Point');

// Cargar la API de Google Maps
onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Reemplaza con tu API key real
    libraries: ["places"],  // Cargar la librería de lugares
  });

  const google = await loader.load();
  if (!mapElement.value || !searchInput.value) return;

  // Obtener la ubicación del usuario desde el localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userLat = parseFloat(user.location.coordinates[0]);
  const userLng = parseFloat(user.location.coordinates[1]);

  // Inicializar el mapa con las coordenadas del usuario
  map.value = new google.maps.Map(mapElement.value, {
    center: { lat: userLat, lng: userLng },
    zoom: 12,
  });

  // Crear el marcador en las coordenadas del usuario
  marker.value = new google.maps.Marker({
    position: { lat: userLat, lng: userLng },
    map: map.value,
    draggable: true,  // Permitir que el marcador sea arrastrable
  });

  // Permitir que el marcador sea arrastrable y actualizar la ubicación
  marker.value.addListener("dragend", (event) => {
    selectedLocation.value = {
      type: locationType.value,
      coordinates: [event.latLng.lat(), event.latLng.lng()],
    };
    emit("updateLocation", selectedLocation.value);  // Emitir nueva ubicación
  });

  // Inicializar Autocompletado
  const autocomplete = new google.maps.places.Autocomplete(searchInput.value);
  autocomplete.bindTo("bounds", map.value);

  // Manejar la selección de un lugar desde el autocompletado
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const location = {
      type: locationType.value,
      coordinates: [
        place.geometry.location.lat(),
        place.geometry.location.lng(),
      ],
    };

    selectedLocation.value = location;
    map.value.setCenter(location.coordinates);

    // Emitir la ubicación al componente padre
    emit("updateLocation", location);

    // Actualizar la posición del marcador
    if (marker.value) {
      marker.value.setPosition({ lat: location.coordinates[0], lng: location.coordinates[1] });
    } else {
      marker.value = new google.maps.Marker({
        position: { lat: location.coordinates[0], lng: location.coordinates[1] },
        map: map.value,
        draggable: true,
      });
    }
  });

  // Manejar clic manual en el mapa
  map.value.addListener("click", (event) => {
    const clickedLocation = {
      type: locationType.value,
      coordinates: [event.latLng.lat(), event.latLng.lng()],
    };

    selectedLocation.value = clickedLocation;
    emit("updateLocation", clickedLocation);

    // Crear un nuevo marcador si no existe
    if (!marker.value) {
      marker.value = new google.maps.Marker({
        position: { lat: clickedLocation.coordinates[0], lng: clickedLocation.coordinates[1] },
        map: map.value,
        draggable: true,
      });

      marker.value.addListener("dragend", (event) => {
        selectedLocation.value = {
          type: locationType.value,
          coordinates: [event.latLng.lat(), event.latLng.lng()],
        };
        emit("updateLocation", selectedLocation.value);
      });
    } else {
      marker.value.setPosition({ lat: clickedLocation.coordinates[0], lng: clickedLocation.coordinates[1] });
    }
  });
});
</script>

<template>
  <div>
    <div class="space-y-2">
      <!-- Entrada de búsqueda para Google Places Autocomplete -->
      <Input ref="searchInput" placeholder="Search location..." class="mb-4" />
    </div>

    <!-- Contenedor del mapa de Google -->
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
