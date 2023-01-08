import { computed, nextTick, reactive, ref } from "vue";

import { get } from "@/axios/axios";

import type { Emote, RawEmote } from "~/emote";
import type { ChatMessage } from "~/message";

const cleanEmoteCode = ({ code, urls }: RawEmote): Emote => ({ code: code.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), url: urls[0].url })

export const useChatHistory = () => {

    const state = reactive({
        isLoading: false,
        error: false
    })

    const channels = import.meta.env.VITE_CHANNEL_NAMES.split(",") as string[]

    const currentChannel = ref(channels[0])

    const emotes = reactive<Record<string, Emote[]>>({});

    const allEmotes = computed(() => Object.values(emotes).flat())

    const messages = reactive<Record<string, ChatMessage[]>>({})

    const currentMessages = computed(() => messages[currentChannel.value] ?? [])

    const getGlobalEmotes = async () => {
        if (emotes.global?.length) return

        const { response, error } = await get<RawEmote[]>("https://emotes.adamcy.pl/v1/global/emotes/twitch")

        if (error || !response) {
            throw (error)
        }
        emotes.global = response.map(cleanEmoteCode)
    };

    const getLocalEmotes = async (channel: string) => {
        if (emotes[channel]?.length) return

        const { response, error } = await get<RawEmote[]>(`https://emotes.adamcy.pl/v1/channel/${channel}/emotes/twitch`)

        if (error || !response) {
            throw (error)
        }

        emotes[channel] = response.map(cleanEmoteCode)
    }


    const getMessages = async (channel: string, days = 2) => {
        const { response, error } = await get<ChatMessage[]>(`${import.meta.env.VITE_SERVER_URL}/chat/${channel}/${days}`)

        if (error || !response) {
            throw (error)
        }

        messages[channel] = response
    }

    const parseMessage = (text: string) => {
        let updatedText = text
        allEmotes.value.forEach(({ code, url }) => {
            const pattern = new RegExp(`\\b${code}\\b`, 'g')

            if (updatedText.match(pattern)) {
                updatedText = updatedText.replaceAll(pattern, ` <span class="inline-block align-middle my-auto"><img class="w-8 h-8" src="${url}"> </span>`)
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