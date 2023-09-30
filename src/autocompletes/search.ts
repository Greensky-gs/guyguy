import { AutocompleteListener } from "amethystjs";
import database from "../cache/database";

export default new AutocompleteListener({
    commandName: [{ commandName: 'désabonner' }],
    listenerName: 'recherche',
    run: ({ focusedValue }) => {
        focusedValue = focusedValue.toLowerCase()

        return database.getValue('searchs').filter(x => x.name.toLowerCase().includes(focusedValue) || focusedValue.includes(x.name.toLowerCase())).slice(0, 24).map((x) => ({ name: x.name, value: x.name }))
    }
})