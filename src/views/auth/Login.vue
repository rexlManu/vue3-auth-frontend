<template>
  <AuthLayout>
    <div class="w-full max-w-md bg-white shadow-md rounded-md">
      <div class="p-8">
        <div class="flex my-3">
          <h1
            class="
              font-bold
              text-2xl
              border-b-2 border-blue-600
              tracking-wide
              pb-1
            "
          >
            Login
          </h1>
        </div>
        <p class="font-normal text-gray-600 text-base">
          Need an Account?
          <a
            href="/register"
            class="
              text-gray-900
              font-medium
              border-b border-transparent
              hover:border-blue-500 hover:text-blue-500
              transition-colors
            "
            >Create Account</a
          >
        </p>
        <form @submit.prevent="onSubmit">
          <div class="flex flex-col my-2">
            <label class="text-gray-900 font-semibold my-1" for="usernameInput"
              >Username</label
            >
            <input
              class="
                border-2 border-gray-200
                rounded-md
                px-3
                py-1
                focus:outline-none focus:border-blue-500
                text-gray-600
              "
              id="usernameInput"
              type="text"
              placeholder="Username"
              required
              v-model="username"
            />
          </div>
          <div class="flex flex-col my-2">
            <label class="text-gray-900 font-semibold my-1" for="passwordInput"
              >Password</label
            >
            <input
              class="
                border-2 border-gray-200
                rounded-md
                px-3
                py-1
                focus:outline-none focus:border-blue-500
                text-gray-600
              "
              id="passwordInput"
              type="password"
              required
              v-model="password"
            />
          </div>
          <div class="flex mt-6">
            <button
              type="submit"
              class="
                flex-grow
                py-2
                border border-blue-500
                text-blue-500
                font-semibold
                rounded-md
                hover:bg-blue-500 hover:text-white
                transition-all
              "
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>
<script lang="ts">
import AuthLayout from '@/components/layouts/AuthLayout.vue';
import { defineComponent, ref } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useApi } from '../../modules/api';
import { useAuth } from '../../modules/auth';

export default defineComponent({
  components: {
    AuthLayout,
  },
  setup() {
    const { loading, data, post, errorMessage } = useApi('auth/login');
    const { setUser } = useAuth();
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    function onSubmit() {
      post({
        username: username.value,
        password: password.value,
      }).then(() => {
        setUser(data.value, true);
        router.push({ name: 'home' });
      });
    }
    return {
      username,
      password,
      onSubmit,
    };
  },
});
</script>
