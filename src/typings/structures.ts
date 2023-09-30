import { AxiosProxyConfig } from "axios"

export type ProxiesCache = {
    proxy: AxiosProxyConfig;
    uses: number;
}