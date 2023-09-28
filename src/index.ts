import { AmethystClient } from "amethystjs";
import { config } from "dotenv";
config()

const client = new AmethystClient({
    intents: ['Guilds']
}, {
    token: process.env.token,
    debug: true,
    eventsFolder: './dist/events',
    commandsFolder: './dist/commands',
    autocompleteListenersFolder: './dist/autocompletes'
})

client.start({})