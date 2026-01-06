import { baseSharableConfig } from "../sharable-configs/base";
import { jsonSharableConfig } from "../sharable-configs/json";
import { reactSharableConfig } from "../sharable-configs/react";
import { reactForNextSharableConfig } from "../sharable-configs/react-for-next";
import { utilsSharableConfig } from "../sharable-configs/utils";

export const nextRules = [
    ...baseSharableConfig,
    ...utilsSharableConfig,
    ...jsonSharableConfig,
    ...reactSharableConfig,
    ...reactForNextSharableConfig,
];
