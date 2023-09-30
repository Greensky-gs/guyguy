import { AmethystCommand, log4js } from "amethystjs";
import { ApplicationCommandOptionType } from "discord.js";
import database from "../cache/database";
import monitor from "../cache/monitor";

export default new AmethystCommand({
    name: 'désabonner',
    description: 'Annule une recherche',
    options: [
        {
            name: 'recherche',
            autocomplete: true,
            type: ApplicationCommandOptionType.String,
            required: true,
            description: "Recherche que vous voulez annuler"
        }
    ]
}).setChatInputRun(async({ interaction, options }) => {
    const name = options.getString('recherche')
    if (!name) return interaction.reply(`:x: | Une erreur s'est produite`).catch(log4js.trace)

    const list = database.getValue('searchs');
    const search = list.find(x => x.name === name)
    database.setValue('searchs', list.filter(x => x.url !== search.url))

    monitor.unWatch(search.url)

    interaction.reply(`La recherche **[${search.name}](<${search.url}>)** a été supprimée`).catch(log4js.trace)
})