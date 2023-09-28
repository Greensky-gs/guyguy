import { AmethystCommand, log4js } from "amethystjs";
import { ApplicationCommandOptionType } from "discord.js";
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
        }
    ]
}).setChatInputRun(async({ interaction, options }) => {
    const search = options.getString('nom')
    const url = options.getString('lien')
    
    if (database.getValue('searchs').find(x => x.name === search)) return interaction.reply({
        content: `Vous avez déjà une recherche de ce nom`
    }).catch(log4js.trace)
    
    if (monitor.cache.find(x => x.subUrl === url)) return interaction.reply({
        content: "Cette url est déjà surveillée"
    }).catch(log4js.trace)

    database.pushTo('searchs', {
        url,
        name: search
    })
    monitor.watch(url)

    interaction.reply({
        content: `Entendu, j'ai crée la recherche **${search}**`
    }).catch(log4js.trace)
})