import { AmethystEvent, log4js } from "amethystjs";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, WebhookClient } from "discord.js";
import monitor from "../cache/monitor";
import { itemEmbed } from "../contents/embeds";
import database from "../cache/database";

export default new AmethystEvent('ready', async(client) => {
    const cache: Record<string, TextChannel> = {}

    monitor.watch(database.getValue('searchs').map(x => x.url))
    monitor.init()
    monitor.onItemFound(async (item, search) => {
        const components = () => {
            return [
                new ActionRowBuilder()
                    .setComponents(
                        new ButtonBuilder()
                            .setLabel('Détails')
                            .setStyle(ButtonStyle.Link)
                            .setEmoji('ℹ️')
                            .setURL(item.info.url),
                        new ButtonBuilder()
                            .setLabel('Paiement')
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://vinted.fr/checkout?transaction_id=${item.info.id}`)
                            .setEmoji('💳')
                    )
            ] as ActionRowBuilder<ButtonBuilder>[]
        }

        const id = search.channelId
        const channel = (cache[id] ?? client.channels.cache.get(id) ?? await client.channels.fetch(id).catch(log4js.trace)) as TextChannel
        if (!channel) return;

        if (!cache[id]) cache[id] = channel

        if (channel) channel.send({
            embeds: [ itemEmbed(client, item) ],
            components: components()
        }).catch(log4js.trace)
    })
})