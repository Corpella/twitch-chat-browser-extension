import { nextTick, reactive, ref } from "vue";

import type { Emote } from "@/types/emote";
import type { ChatMessage } from "@/types/message";

export const useChatHistory = () => {

    //TODO: implement in the future
    // const getGlobalEmotes = async () => {
    //     const response = await fetch(
    //         "https://emotes.adamcy.pl/v1/global/emotes/twitch"
    //     );

    //     const globalEmotes = await response.json()
    //     console.log(globalEmotes);
    // };

    const state = reactive({
        isLoading: false,
        error: false
    })

    const localEmotes = ref<Emote[]>([]);

    const getLocalEmotes = async () => {
        const response = await fetch(
            `https://emotes.adamcy.pl/v1/channel/${import.meta.env.VITE_CHANNEL_NAME}/emotes/twitch`
        );
        localEmotes.value = await response.json()
    }

    const messages = ref<ChatMessage[]>([])

    const getMessages = async (days = 2) => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat/${days}`)



        messages.value = await response.json()
        console.log({ response, messages: messages.value });
    }

    const parseMessage = (text: string) => {
        let updatedText = text
        localEmotes.value.forEach(({ code, urls }) => {
            if (updatedText.includes(code)) {
                updatedText = updatedText.replaceAll(code, ` <div class="inline-block align-middle my-auto"><img class="w-8 h-8" src="${urls[0].url}"> </div>`)
            }
        })
        return updatedText
    }

    const init = async () => {
        state.isLoading = true

        try {
            await getLocalEmotes()
            await getMessages()
        }
        catch (error) {
            state.error = true
        }
        finally {
            state.isLoading = false
        }
        nextTick(() => {
            window.scrollTo(0, document.body.scrollHeight);
        })

    }


    return {
        localEmotes,
        getLocalEmotes,
        messages,
        getMessages,
        parseMessage,
        state,
        init
    }
};

