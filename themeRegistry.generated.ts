import { ThemeRegistryEntry } from "./themeRegistryEntry.js";
import { AliceTheme } from "./alice/index.js";
import { BoilingDieselTheme } from "./boiling-diesel/index.js";
import { GnapTheme } from "./gnap/index.js";
import { HoldenWreckTheme } from "./holden-wreck/index.js";
import { LenaTheme } from "./lena/index.js";
import { MatildaTheme } from "./matilda/index.js";
import { MinimalTheme } from "./minimal/index.js";
import { TimesTheme } from "./times/index.js";
import { TypewriterTheme } from "./typewriter/index.js";
import { WinterTheme } from "./winter/index.js";
const ThemeRegistry: Record<string, ThemeRegistryEntry> = {
  [AliceTheme.meta.id]: {
    type: AliceTheme,
    title: AliceTheme.meta.title,
    description: AliceTheme.meta.description,
    tags: AliceTheme.meta.tags
  },
  [BoilingDieselTheme.meta.id]: {
    type: BoilingDieselTheme,
    title: BoilingDieselTheme.meta.title,
    description: BoilingDieselTheme.meta.description,
    tags: BoilingDieselTheme.meta.tags
  },
  [GnapTheme.meta.id]: {
    type: GnapTheme,
    title: GnapTheme.meta.title,
    description: GnapTheme.meta.description,
    tags: GnapTheme.meta.tags
  },
  [HoldenWreckTheme.meta.id]: {
    type: HoldenWreckTheme,
    title: HoldenWreckTheme.meta.title,
    description: HoldenWreckTheme.meta.description,
    tags: HoldenWreckTheme.meta.tags
  },
  [LenaTheme.meta.id]: {
    type: LenaTheme,
    title: LenaTheme.meta.title,
    description: LenaTheme.meta.description,
    tags: LenaTheme.meta.tags
  },
  [MatildaTheme.meta.id]: {
    type: MatildaTheme,
    title: MatildaTheme.meta.title,
    description: MatildaTheme.meta.description,
    tags: MatildaTheme.meta.tags
  },
  [MinimalTheme.meta.id]: {
    type: MinimalTheme,
    title: MinimalTheme.meta.title,
    description: MinimalTheme.meta.description,
    tags: MinimalTheme.meta.tags
  },
  [TimesTheme.meta.id]: {
    type: TimesTheme,
    title: TimesTheme.meta.title,
    description: TimesTheme.meta.description,
    tags: TimesTheme.meta.tags
  },
  [TypewriterTheme.meta.id]: {
    type: TypewriterTheme,
    title: TypewriterTheme.meta.title,
    description: TypewriterTheme.meta.description,
    tags: TypewriterTheme.meta.tags
  },
  [WinterTheme.meta.id]: {
    type: WinterTheme,
    title: WinterTheme.meta.title,
    description: WinterTheme.meta.description,
    tags: WinterTheme.meta.tags
  }    
};
export default ThemeRegistry;

