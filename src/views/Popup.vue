<script setup lang="ts">
import { ref } from "vue"

import { useChatHistory } from "@/composables/useChatHistory"

const { init, parseMessage, state, currentMessages, currentChannel, channels, setCurrentChannel } = useChatHistory()

const getFormattedDate = (date: string) =>
    new Date(date).toLocaleDateString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
    })

const channelSize = Math.floor(100 / channels.length)
const sliderSize = `${channelSize}%`

const sliderOffset = ref("0%")

const selectChannel = (channel: string, index: number) => {
    sliderOffset.value = `${channelSize * index}%`
    setCurrentChannel(channel)
}

init(currentChannel.value)
</script>

<template>
    <div class="w-full min-w-[34rem] max-w-[42rem]">
        <header class="sticky top-0 flex w-full items-center bg-[#18181b]" role="tablist">
            <button
                v-for="(channel, index) in channels"
                class="tab-button w-full py-3 text-lg font-bold text-white"
                role="tab"
                :aria-selected="channel === currentChannel ? 'true' : 'false'"
                :key="channel"
                @click="selectChannel(channel, index)"
            >
                <h3>
                    {{ channel }}
                </h3>
            </button>
            <span class="slider" />
        </header>
        <main class="w-full bg-[#342e45] text-lg">
            <p class="p-5 text-center text-white" v-if="state.isLoading || !currentMessages.length">Loading</p>
            <ul v-else class="flex w-full flex-col gap-2">
                <li
                    v-for="({ color, message, name, createdAt }, index) in currentMessages"
                    class="inline-block min-h-[2.5rem] w-full py-2 px-2"
                    :key="`${name}-${index}`"
                >
                    <span class="max-w-8 text-white\ my-auto min-w-[2rem] pr-1 align-middle text-[#bf94ff]">
                        {{ `[${getFormattedDate(createdAt)}]` }}
                    </span>
                    <span
                        class="my-auto px-1 text-center align-middle font-bold"
                        :style="{ color: color || '#7878ff' }"
                        >{{ name }}</span
                    >
                    <span class="my-auto pr-1 font-bold">{{ ":" }}</span>
                    <span class="text-white" v-html="parseMessage(message)" />
                </li>
            </ul>
        </main>
    </div>
</template>

<style scoped>
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
button[aria-selected="true"] {
    color: #bf94ff;
}
.slider {
    @apply absolute bottom-0 border-b-2 border-[#bf94ff];
    transition: left 200ms linear;
    width: v-bind(sliderSize);
    left: v-bind(sliderOffset);
}
</style>
