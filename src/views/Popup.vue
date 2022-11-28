<script setup lang="ts">
import { useChatHistory } from "@/composables/useChatHistory"

const { init, messages, parseMessage, state } = useChatHistory()

init()
</script>

<template>
    <div class="w-full min-w-[32rem] max-w-[40rem] bg-[#342e45] text-lg">
        <p class="p-5 text-center text-white" v-if="state.isLoading || !messages.length">Loading</p>
        <ul v-else class="flex w-full flex-col gap-2">
            <li v-for="({ color, message, name }, index) in messages" :key="`${name}-${index}`">
                <div class="inline-block min-h-[2.5rem] w-full py-2 px-2">
                    <span
                        class="my-auto mr-1 text-center align-middle font-bold"
                        :style="{ color: color || '#7878ff' }"
                        >{{ name }}</span
                    >
                    <span class="my-auto mr-1 font-bold">{{ ":" }}</span>
                    <span class="text-white" v-html="parseMessage(message)" />
                </div>
            </li>
        </ul>
    </div>
</template>

<style>
/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #342e45;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
