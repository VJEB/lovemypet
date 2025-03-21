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
            transform: `translate(${secondaryButtonPositions[index].x}px, ${secondaryButtonPositions[index].y}px)`,
            opacity: selectedAction !== null ? 1 : 0,
            pointerEvents: selectedAction !== null ? 'auto' : 'none',
          }"
        >
          <div class="relative">
            <span
              v-if="option.label"
              class="absolute right-full mr-2 whitespace-nowrap bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-90"
            >
              {{ option.label }}
            </span>
            <button
              @click="() => handleSecondaryClick(option)"
              :class="[
                'rounded-full w-12 h-12 flex items-center justify-center shadow-lg',
                option.color || 'bg-gray-500',
              ]"
            >
              <component :is="option.icon" class="h-5 w-5 text-purple-600" />
            </button>
          </div>
        </div>
      </div>
  
  
      <!-- Botón de acción principal -->
      <button
        @click="handlePrimaryClick"
        :class="[
          'rounded-full w-14 h-14 flex items-center bg-white justify-center text-purple-500 shadow-lg transition-transform duration-200',
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

      ],
    },
  });
  
  const isOpen = ref(false);
  const selectedAction = ref(null);
  
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
      selectedAction.value = null;
    } else {
      selectedAction.value = index;
      // Optionally hide the primary actions by closing the main menu.
      // isOpen.value = false;
    }
  };
  
  const handleSecondaryClick = (option) => {
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
    const angleStep =
      (140 - 80) / (totalButtons - 1 || 1);
    return props.secondaryOptions.map((_, index) => {
      const angle = ((80 + index * angleStep) * Math.PI) / 90;
      return {
        x: props.radius * Math.cos(angle),
        y: props.radius * Math.sin(angle),
      };
    });
  });
  </script>
  