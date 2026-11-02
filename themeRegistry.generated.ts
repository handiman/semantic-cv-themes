import { ThemeRegistryEntry } from "./themeRegistryEntry.js";
import { AliceTheme } from "./alice/index.js";
import { BlueprintTheme } from "./blueprint/index.js";
import { BoilingDieselTheme } from "./boiling-diesel/index.js";
import { GnapTheme } from "./gnap/index.js";
import { HoldenWreckTheme } from "./holden-wreck/index.js";
import { LenaTheme } from "./lena/index.js";
import { MatildaTheme } from "./matilda/index.js";
import { MinimalTheme } from "./minimal/index.js";
import { ProofOfWorkTheme } from "./proof-of-work/index.js";
import { StandardIssueTheme } from "./standard-issue/index.js";
import { TerminalTheme } from "./terminal/index.js";
import { TimelineTheme } from "./timeline/index.js";
import { TimesTheme } from "./times/index.js";
import { TypewriterTheme } from "./typewriter/index.js";
import { WinterTheme } from "./winter/index.js";
import { ZurichTheme } from "./zurich/index.js";
const ThemeRegistry: Record<string, ThemeRegistryEntry> = {
  [AliceTheme.meta.id]: {
    type: AliceTheme,
    title: AliceTheme.meta.title,
    description: AliceTheme.meta.description,
    tags: AliceTheme.meta.tags
  },
  [BlueprintTheme.meta.id]: {
    type: BlueprintTheme,
    title: BlueprintTheme.meta.title,
    description: BlueprintTheme.meta.description,
    tags: BlueprintTheme.meta.tags
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
  [ProofOfWorkTheme.meta.id]: {
    type: ProofOfWorkTheme,
    title: ProofOfWorkTheme.meta.title,
    description: ProofOfWorkTheme.meta.description,
    tags: ProofOfWorkTheme.meta.tags
  },
  [StandardIssueTheme.meta.id]: {
    type: StandardIssueTheme,
    title: StandardIssueTheme.meta.title,
    description: StandardIssueTheme.meta.description,
    tags: StandardIssueTheme.meta.tags
  },
  [TerminalTheme.meta.id]: {
    type: TerminalTheme,
    title: TerminalTheme.meta.title,
    description: TerminalTheme.meta.description,
    tags: TerminalTheme.meta.tags
  },
  [TimelineTheme.meta.id]: {
    type: TimelineTheme,
    title: TimelineTheme.meta.title,
    description: TimelineTheme.meta.description,
    tags: TimelineTheme.meta.tags
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
  },
  [ZurichTheme.meta.id]: {
    type: ZurichTheme,
    title: ZurichTheme.meta.title,
    description: ZurichTheme.meta.description,
    tags: ZurichTheme.meta.tags
  }    
};
export default ThemeRegistry;

