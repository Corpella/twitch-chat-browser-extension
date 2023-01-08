type EmoteURL = {
    size: string,
    url: string
}
export type RawEmote = {
    provider: number,
    code: string,
    urls: EmoteURL[]
}
export type Emote = {
    code: string,
    url: string
}