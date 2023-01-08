import { computed, nextTick, reactive, ref } from "vue";

import { get } from "@/axios/axios";

import type { Emote } from "@/types/emote";
import type { ChatMessage } from "@/types/message";


export const useChatHistory = () => {

    const state = reactive({
        isLoading: false,
        error: false
    })

    const channels = import.meta.env.VITE_CHANNEL_NAMES.split(",") as string[]

    const currentChannel = ref(channels[0])

    const emotes = reactive<Record<string, Emote[]>>({});

    const allEmotes = computed(() => Object.values(emotes))

    const messages = reactive<Record<string, ChatMessage[]>>({})

    const currentMessages = computed(() => messages[currentChannel.value] ?? [])

    const getGlobalEmotes = async () => {
        if (emotes.global?.length) return

        const { response, error } = await get<Emote[]>("https://emotes.adamcy.pl/v1/global/emotes/twitch")

        if (error || !response) {
            throw (error)
        }

        emotes.global = response
    };

    const getLocalEmotes = async (channel: string) => {
        if (emotes[channel]?.length) return

        const { response, error } = await get<Emote[]>(`https://emotes.adamcy.pl/v1/channel/${channel}/emotes/twitch`)

        if (error || !response) {
            throw (error)
        }

        emotes[channel] = response
    }


    const getMessages = async (channel: string, days = 2) => {

        const { response, error } = await get<ChatMessage[]>(`${import.meta.env.VITE_SERVER_URL}/chat/${channel}/${days}`)

        if (error || !response) {
            throw (error)
        }

        messages[channel] = response
    }

    const parseMessage = (text: string, channel: string) => {
        let updatedText = text
        emotes[channel].forEach(({ code, urls }) => {
            if (updatedText.includes(code)) {
                updatedText = updatedText.replaceAll(code, ` <div class="inline-block align-middle my-auto"><img class="w-8 h-8" src="${urls[0].url}"> </div>`)
            }
        })
        return updatedText
    }

    const init = async (channel: string) => {
        !messages[channel]?.length && (state.isLoading = true)

        try {
            await getGlobalEmotes()
            await getLocalEmotes(channel)
            await getMessages(channel)
        }
        catch (error) {
            state.error = true
        }
        finally {
            state.isLoading = false
            nextTick(() => {
                window.scrollTo(0, document.body.scrollHeight);
            })
        }

    }

    const setCurrentChannel = (channel: string) => {
        currentChannel.value = channel
        init(channel)
    }


    return {
        state,
        channels,
        currentChannel,
        setCurrentChannel,
        getMessages,
        messages,
        currentMessages,
        parseMessage,
        allEmotes,
        init,
    }
}