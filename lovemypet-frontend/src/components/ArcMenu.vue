<template>
  <div class="fixed bottom-20 right-4 z-50">
    <!-- Secondary options -->
    <div
      v-if="selectedAction !== null"
      class="absolute transition-all duration-300 ease-in-out"
    >
      <div
        v-for="(option, index) in secondaryOptions"
        :key="index"
        class="absolute transition-all duration-300 ease-in-out"
        :style="{
          transform: `translate(${secondaryButtonPositions[index].x}px, 
            ${secondaryButtonPositions[index].y}px)`,
          opacity: selectedAction !== null ? 1 : 0,
          pointerEvents: selectedAction !== null ? 'auto' : 'none',
        }"
      >
        <div class="relative">
          <span
            v-if="option.label"
            class="absolute right-full mr-2 whitespace-nowrap bg-gray-800 
            text-white text-xs py-1 px-2 rounded opacity-90"
          >
            {{ option.label }}
          </span>
          <button
            @click="() => handleSecondaryClick(option)"
            class="rounded-full w-12 h-12 flex items-center bg-white justify-center shadow-lg"
          >
            <component :is="option.icon" class="h-5 w-5 text-purple-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Primary action buttons (hidden when an action is selected) -->
    <div
      v-if="selectedAction === null"
      v-for="(action, index) in actions"
      :key="index"
      class="absolute transition-all duration-300 ease-in-out"
      :style="{
        transform: isOpen
          ? `translate(${buttonPositions[index].x}px, ${buttonPositions[index].y}px)`
          : 'translate(0, 0)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }"
    >
      <div class="relative">
        <span
          v-if="action.label"
          class="absolute right-full mr-2 whitespace-nowrap bg-gray-800 
            text-white text-xs py-1 px-2 rounded opacity-90"
        >
          {{ action.label }}
        </span>
        <button
          @click="handleActionClick(index)"
          class="rounded-full w-12 h-12 flex items-center bg-white justify-center shadow-lg"
        >
          <component :is="action.icon" class="h-5 w-5 text-purple-600" />
        </button>
      </div>
    </div>

    <!-- Botón de acción principal -->
    <button
      @click="handlePrimaryClick"
      :class="[
        `rounded-full w-14 h-14 flex items-center bg-white justify-center 
        text-purple-500 shadow-lg transition-transform duration-200`,
        isOpen ? 'rotate-45' : '',
      ]"
      aria-label="Toggle action menu"
    >
      <Plus />
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Plus, Cat, Dog, Heart, Search, House } from "lucide-vue-next";

const props = defineProps({
  primaryIcon: { type: Function, default: () => Plus },
  primaryAction: { type: Function, default: null },
  radius: { type: Number, default: 80 },
  startAngle: { type: Number, default: 90 },
  endAngle: { type: Number, default: 130 },
  actions: {
    type: Array,
    default: () => [
      {
        icon: Cat,
        onClick: () => console.log("Cat"),
        label: "Cats",
      },
      {
        icon: Dog,
        onClick: () => console.log("Dog"),
        label: "Dogs",
      },
    ],
  },
  secondaryOptions: {
    type: Array,
    default: () => [
      {
        icon: House,
        onClick: () => console.log("Search"),
        label: "Adoption",
      },
      {
        icon: Heart,
        onClick: () => console.log("Mating"),
        label: "Mating",
      },
      {
        icon: Search,
        onClick: () => console.log("Search"),
        label: "Search",
      },
    ],
  },
});

const isOpen = ref(false);
const selectedAction = ref(null);
const category = ref(null); // Almacena la categoría seleccionada: 'Cat' o 'Dog'
const option = ref(null); // Almacena la opción seleccionada: 'Adoption', 'Mating', 'Search'

const categorySelection = (category) => {
  console.log("Category", category);
};

const handlePrimaryClick = () => {
  if (props.primaryAction) {
    props.primaryAction();
  } else {
    isOpen.value = !isOpen.value;
    // Reset selected action if closing the main menu
    if (!isOpen.value) {
      selectedAction.value = null;
    }
  }
};

const handleActionClick = (index) => {
  // Set the selected action and hide the primary action buttons.
  if (selectedAction.value === index) {
    console.log("Index", index);
    selectedAction.value = null;
  } else {
    console.log("Index", index);
    category.value = index;
    selectedAction.value = index;
    // Optionally hide the primary actions by closing the main menu.
    // isOpen.value = false;
  }
};

const handleSecondaryClick = async (option) => {
  const category2 = category.value === 1 ? "Dog" : "Cat";
  const model = {
    category: category2,
    status: option.label,
  };
  try {
    const response = await fetch(`http://localhost:3000/pets/byCategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    });
    const data = await response.json();
    localStorage.setItem("dataFilter", JSON.stringify(data));
    window.location.reload();
    console.log("PetsValue3", data);
  } catch (err) {
    error.value = err.message;
  }
  option.onClick();
  isOpen.value = false;
  selectedAction.value = null;
};

const buttonPositions = computed(() => {
  const totalButtons = props.actions.length;
  const angleStep =
    (props.endAngle - props.startAngle) / (totalButtons - 1 || 1);
  return props.actions.map((_, index) => {
    const angle = ((props.startAngle + index * angleStep) * Math.PI) / 90;
    return {
      x: props.radius * Math.cos(angle),
      y: props.radius * Math.sin(angle),
    };
  });
});

const secondaryButtonPositions = computed(() => {
  const totalButtons = props.secondaryOptions.length;
  const angleStep = (140 - 80) / (totalButtons - 1 || 1);
  return props.secondaryOptions.map((_, index) => {
    const angle = ((80 + index * angleStep) * Math.PI) / 90;
    return {
      x: props.radius * Math.cos(angle),
      y: props.radius * Math.sin(angle),
    };
  });
});
</script>
