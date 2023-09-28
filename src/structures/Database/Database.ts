import db from '../../data/db.json'
import { writeFileSync } from 'node:fs'

export class Database {
    private datas: typeof db = db;

    constructor() {}

    public getValue<Key extends keyof typeof db>(key: Key): typeof db[Key] {
        return this.datas[key]
    }
    public pushTo<Key extends keyof typeof db>(key: Key, value: any) {
        this.datas[key].push(value)
        this.save()

        return this.datas[key]
    }
    public removeFrom<Key extends keyof typeof db>(key: Key, value: any) {
        this.datas[key] = this.datas[key].filter(x => x !== value);
        this.save()

        return this.datas[key]
    }
    public setValue<Key extends keyof typeof db>(key: Key, value: typeof db[Key]) {
        this.datas[key] = value
        this.save()
    }

    private save() {
        writeFileSync(`./dist/data/db.json`, JSON.stringify(this.datas))
    }
}