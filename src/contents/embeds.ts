import { Client, ColorResolvable, EmbedBuilder } from "discord.js";
import VintedItem from "../structures/monitor/class/VintedItem";
import { Item } from "../typings/vinted";

export const itemEmbed = (client: Client, item: VintedItem) => {
    const currencies = {
        EUR: '€',
        USD: '$'
    }
    const currency = (x: string) => currencies[x] ?? x
    return new EmbedBuilder()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setColor(item.info.photo.dominant_color as ColorResolvable)
        .setURL(item.info.url)
        .setTitle(item.info.title)
        .setFields(
            {
                name: 'Prix',
                value: `${item.info.price.amount}${currency(item.info.price.currency_code)} ( total ${item.info.total_item_price.amount}${currency(item.info.total_item_price.currency_code)} )`,
                inline: true
            },
            {
                name: 'Marque',
                value: !!item.info.brand_title ? item.info.brand_title : 'N/A',
                inline: true
            },
            {
                name: 'Taille',
                value: !!item.info.size_title ? item.info.size_title : 'N/A',
                inline: true
            },
            {
                name: 'Vendeur',
                value: `[${item.user.login}](${item.user.profile_url})`,
                inline: false
            }
        )
        .setImage(item.info.photo.url)
        .setTimestamp(item.info.date)
}
export const androzItemEmbed = (client: Client, item: Item) => {
    const currencies = {
        EUR: '€',
        USD: '$'
    }
    const currency = (x: string) => currencies[x] ?? x
    return new EmbedBuilder()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setColor(item?.photo?.dominant_color as ColorResolvable ?? 'Orange')
        .setURL(item.url)
        .setTitle(item.title)
        .setFields(
            {
                name: 'Prix',
                value: `${item.price}${currency(item.currency)} ( total ${item.total_item_price}${currency(item.currency)} )`,
                inline: true
            },
            {
                name: 'Marque',
                value: !!item.brand_title ? item.brand_title : 'N/A',
                inline: true
            },
            {
                name: 'Taille',
                value: !!item.size_title ? item.size_title : 'N/A',
                inline: true
            },
            {
                name: 'Vendeur',
                value: `[${item.user.login}](${item.user.profile_url})`,
                inline: false
            }
        )
        .setImage(item.photo.url)
}