# Bot vinted

Bot vinted qui envoie les nouveaux posts

## Utilisation

1. Cloner le projet `git clone https://github.com/Greensky-gs/guyguy`
1. Créer et remplir le fichier `.env` comme [`.env.example`](./.env.example)
1. Si yarn n'est pas installé, installer yarn ( `npm i -g yarn` )
1. Démarrer le bot `yarn launch`

## Proxy

Pour ajouter des proxy, il faut rajouter des informations dans le fichier [`./src/data/proxies.json`](./src/data/proxies.json). Il faut remplir ce fichier **avant** la compilation

Le fichier `proxies.json` est un tableau de proxy.

Informations à donner dans le tableau :

```ts
{
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: string;
}
```

Par exemple

```json
[
    {
        "host": "1.2.3.4",
        "port": 1234
    }
]
```

## Contact

Pour contacter Greensky, envoyez lui un mail ( à `draver.industries@proton.me` ), un message par [instagram](https://instagram.com/draverindustries) ou rejoignez le [serveur de support](https://discord.gg/fHyN5w84g6)
