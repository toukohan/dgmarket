import { baseSharableConfig } from "../sharable-configs/base";
import { jsonSharableConfig } from "../sharable-configs/json";
import { reactSharableConfig } from "../sharable-configs/react";
import { utilsSharableConfig } from "../sharable-configs/utils";

export const globalRules = [
    ...baseSharableConfig,
    ...utilsSharableConfig,
    ...jsonSharableConfig,
    ...reactSharableConfig,
];
