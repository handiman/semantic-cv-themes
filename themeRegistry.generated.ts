import { ThemeRegistryEntry } from "./themeRegistryEntry.js";
import { titleify } from "./theme.js";
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
  [BoilingDieselTheme.id]: {
    type: BoilingDieselTheme,
    title: BoilingDieselTheme.title ?? titleify(BoilingDieselTheme.id),
    description: BoilingDieselTheme.description,
    tags: BoilingDieselTheme.tags
  },
  [GnapTheme.id]: {
    type: GnapTheme,
    title: GnapTheme.title ?? titleify(GnapTheme.id),
    description: GnapTheme.description,
    tags: GnapTheme.tags
  },
  [HoldenWreckTheme.id]: {
    type: HoldenWreckTheme,
    title: HoldenWreckTheme.title ?? titleify(HoldenWreckTheme.id),
    description: HoldenWreckTheme.description,
    tags: HoldenWreckTheme.tags
  },
  [LenaTheme.id]: {
    type: LenaTheme,
    title: LenaTheme.title ?? titleify(LenaTheme.id),
    description: LenaTheme.description,
    tags: LenaTheme.tags
  },
  [MatildaTheme.id]: {
    type: MatildaTheme,
    title: MatildaTheme.title ?? titleify(MatildaTheme.id),
    description: MatildaTheme.description,
    tags: MatildaTheme.tags
  },
  [MinimalTheme.id]: {
    type: MinimalTheme,
    title: MinimalTheme.title ?? titleify(MinimalTheme.id),
    description: MinimalTheme.description,
    tags: MinimalTheme.tags
  },
  [TimesTheme.id]: {
    type: TimesTheme,
    title: TimesTheme.title ?? titleify(TimesTheme.id),
    description: TimesTheme.description,
    tags: TimesTheme.tags
  },
  [TypewriterTheme.id]: {
    type: TypewriterTheme,
    title: TypewriterTheme.title ?? titleify(TypewriterTheme.id),
    description: TypewriterTheme.description,
    tags: TypewriterTheme.tags
  },
  [WinterTheme.id]: {
    type: WinterTheme,
    title: WinterTheme.title ?? titleify(WinterTheme.id),
    description: WinterTheme.description,
    tags: WinterTheme.tags
  }    
};
export default ThemeRegistry;

