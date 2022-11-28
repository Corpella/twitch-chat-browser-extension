type EmoteURL = {
    size: string,
    url: string
}
export type Emote = {
    provider: number,
    code: string,
    urls: EmoteURL[]

}