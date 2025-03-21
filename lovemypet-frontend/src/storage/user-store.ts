// store.js
import type { User } from "@/models/user.interface";
import { reactive } from "vue";

export const store = reactive({
  user: {
    location: [] as number[],
    _id: "",
    name: "",
    email: "",
    phoneNumber: ""
  },
  setUser(user: User) {
    this.user = user
  }
});
