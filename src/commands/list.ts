import { AmethystCommand, AmethystPaginator, log4js } from "amethystjs";
import database from "../cache/database";
import { chunkArray } from "../utils/toolbox";
import { EmbedBuilder } from "discord.js";

export default new AmethystCommand({
    name: 'liste',
    description: "Affiche la liste de vos abonnements"
}).setChatInputRun(({ interaction, options }) => {
    const subscriptions = database.getValue('searchs');
    if (subscriptions.length === 0) return interaction.reply(":x: | Vous n'avez aucun abonnement en cours").catch(log4js.trace)

    const packetSize = 25
    const packets = chunkArray(subscriptions, packetSize)

    const embed = (packet: { url: string; name: string; channelId: string; }[]) => {
        return new EmbedBuilder()
            .setTitle("Abonnements")
            .setDescription(`${packet.map(x => `[${x.name}](${x.url}) dans <#${x.channelId}>`).join('\n')}`)
            .setColor('Orange')
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    }

    if (packets.length <= packetSize) {
        interaction.reply({
            embeds: [embed(packets[0])]
        }).catch(log4js.trace)
    } else {
        new AmethystPaginator({
            embeds: packets.map(embed),
            displayPages: 'footer',
            modal: {
                title: 'Page',
                fieldName: "Numéro de page"
            },
            user: interaction.user,
            interaction,
            invalidPageContent: (max) => ({ content: `:x: | Veuillez choisir un nombre entre **1** et **${max}**` }),
            numeriseLocale: 'fr',
            cancelContent: {content: "Annulé", embeds: []},
            interactionNotAllowedContent: {
                content: ":x: | Vous ne pouvez pas interagir avec ce message",
                ephemeral: true
            }
        })
    }
})