import { AmethystCommand, log4js, wait } from "amethystjs";
import { ApplicationCommandOptionType, ChannelType, TextChannel } from "discord.js";
import monitor from "../cache/monitor";
import database from "../cache/database";

export default new AmethystCommand({
    name: 'recherche',
    description: "Initialise une recherche",
    options: [
        {
            name: 'nom',
            description: "Nom de la recherche",
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'lien',
            description: "Lien de la recherche",
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'salon',
            description: "Salon dans lequel le message sera envoyé",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText]
        }
    ]
}).setChatInputRun(async({ interaction, options }) => {
    const search = options.getString('nom')
    const url = options.getString('lien')
    const channel = options.getChannel('salon') as TextChannel

    if (database.getValue('searchs').find(x => x.name === search)) return interaction.reply({
        content: `Vous avez déjà une recherche de ce nom`
    }).catch(log4js.trace)
    
    if (monitor.cache.find(x => x === url)) return interaction.reply({
        content: "Cette url est déjà surveillée"
    }).catch(log4js.trace)

    await interaction.reply({
        content: "🚧 | Vérification..."
    }).catch(log4js.trace)
    const res = await channel.send({
        content: `ℹ️ | Des messages seront envoyés dans ce salon`
    }).catch(log4js.trace)
    await wait(Math.floor(Math.random() * 3000) + 2000)

    if (!res) return interaction.editReply({
        content: `:x: | Je n'ai pas pu envoyer de message dans le salon <#${channel.id}>`
    }).catch(log4js.trace)

    database.pushTo('searchs', {
        url,
        name: search,
        channelId: channel.id
    })
    monitor.watch(url)

    interaction.editReply({
        content: `Entendu, j'ai crée la recherche **${search}**`
    }).catch(log4js.trace)
})