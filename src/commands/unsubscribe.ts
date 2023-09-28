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
    const url = options.getString('recherche')
    if (!url) return interaction.reply(`:x: | Une erreur s'est produite`).catch(log4js.trace)

    const list = database.getValue('searchs');
    const search = list.find(x => x.url === url)
    database.setValue('searchs', list.filter(x => x.url !== url))

    monitor.unWatch(url)

    interaction.reply(`La recherche **[${search.name}](<${url}>)** a été supprimée`).catch(log4js.trace)
})