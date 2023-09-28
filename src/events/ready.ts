import { AmethystEvent, log4js } from "amethystjs";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, WebhookClient } from "discord.js";
import monitor from "../cache/monitor";
import { itemEmbed } from "../contents/embeds";
import database from "../cache/database";

export default new AmethystEvent('ready', async(client) => {
    const channel = (client.channels.cache.get(process.env.channelId) ?? await client.channels.fetch(process.env.channelId).catch(log4js.trace)) as TextChannel
    if (!channel) {
        throw new Error("No channel found")
    }

    monitor.watch(database.getValue('searchs').map(x => x.url))
    monitor.onItemFound((item) => {
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
                            .setLabel('Paiment')
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://vinted.fr/checkout?transaction_id=${item.info.id}`)
                            .setEmoji('💳')
                    )
            ] as ActionRowBuilder<ButtonBuilder>[]
        }

        if (channel) channel.send({
            embeds: [ itemEmbed(client, item) ],
            components: components()
        }).catch(log4js.trace)
    })
})