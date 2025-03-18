<template>
  <div
    class="fixed z-10 top-0 left-0 w-[100%] bg-white border-t border-gray-200 flex justify-around items-center py-2"
  >
    <button 
        @click="goBack" 
        class="text-gray-600 cursor-pointer hover:text-gray-800 mr-4"
    >
        <ArrowLeft/>
    </button>
    <h1 className="text-lg font-medium text-gray-800 ">Cat Category</h1>
    <!-- <button @click="goBack" class="text-gray-600 hover:text-gray-800 mr-4">
        <ArrowLeft/>
    </button> -->
    <div></div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

import { ArrowLeft } from "lucide-vue-next";

const router = useRouter();

const goBack = () => {
  router.push("/");
};
</script>
