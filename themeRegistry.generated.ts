import { ThemeRegistryEntry } from "./themeRegistryEntry.js";
import { AliceTheme } from "./alice/index.js";
import { AuroraTheme } from "./aurora/index.js";
import { BentoTheme } from "./bento/index.js";
import { BlueprintTheme } from "./blueprint/index.js";
import { BoilingDieselTheme } from "./boiling-diesel/index.js";
import { BusinessCasualTheme } from "./business-casual/index.js";
import { GnapTheme } from "./gnap/index.js";
import { HoldenWreckTheme } from "./holden-wreck/index.js";
import { JavaBeanTheme } from "./java-bean/index.js";
import { LenaTheme } from "./lena/index.js";
import { LetterheadTheme } from "./letterhead/index.js";
import { MatildaTheme } from "./matilda/index.js";
import { MinimalTheme } from "./minimal/index.js";
import { OnePagerTheme } from "./one-pager/index.js";
import { ProofOfWorkTheme } from "./proof-of-work/index.js";
import { QuarterlyTheme } from "./quarterly/index.js";
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
  [AuroraTheme.meta.id]: {
    type: AuroraTheme,
    title: AuroraTheme.meta.title,
    description: AuroraTheme.meta.description,
    tags: AuroraTheme.meta.tags
  },
  [BentoTheme.meta.id]: {
    type: BentoTheme,
    title: BentoTheme.meta.title,
    description: BentoTheme.meta.description,
    tags: BentoTheme.meta.tags
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
  [BusinessCasualTheme.meta.id]: {
    type: BusinessCasualTheme,
    title: BusinessCasualTheme.meta.title,
    description: BusinessCasualTheme.meta.description,
    tags: BusinessCasualTheme.meta.tags
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
  [JavaBeanTheme.meta.id]: {
    type: JavaBeanTheme,
    title: JavaBeanTheme.meta.title,
    description: JavaBeanTheme.meta.description,
    tags: JavaBeanTheme.meta.tags
  },
  [LenaTheme.meta.id]: {
    type: LenaTheme,
    title: LenaTheme.meta.title,
    description: LenaTheme.meta.description,
    tags: LenaTheme.meta.tags
  },
  [LetterheadTheme.meta.id]: {
    type: LetterheadTheme,
    title: LetterheadTheme.meta.title,
    description: LetterheadTheme.meta.description,
    tags: LetterheadTheme.meta.tags
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
  [OnePagerTheme.meta.id]: {
    type: OnePagerTheme,
    title: OnePagerTheme.meta.title,
    description: OnePagerTheme.meta.description,
    tags: OnePagerTheme.meta.tags
  },
  [ProofOfWorkTheme.meta.id]: {
    type: ProofOfWorkTheme,
    title: ProofOfWorkTheme.meta.title,
    description: ProofOfWorkTheme.meta.description,
    tags: ProofOfWorkTheme.meta.tags
  },
  [QuarterlyTheme.meta.id]: {
    type: QuarterlyTheme,
    title: QuarterlyTheme.meta.title,
    description: QuarterlyTheme.meta.description,
    tags: QuarterlyTheme.meta.tags
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

