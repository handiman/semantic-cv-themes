import { ThemeRegistryEntry } from "./themeRegistryEntry.js";
import { AliceTheme } from "./alice/index.js";
import { AuroraTheme } from "./aurora/index.js";
import { BentoTheme } from "./bento/index.js";
import { BlueprintTheme } from "./blueprint/index.js";
import { BoilingDieselTheme } from "./boiling-diesel/index.js";
import { BusinessCasualTheme } from "./business-casual/index.js";
import { FjordTheme } from "./fjord/index.js";
import { GnapTheme } from "./gnap/index.js";
import { HoldenWreckTheme } from "./holden-wreck/index.js";
import { JavaBeanTheme } from "./java-bean/index.js";
import { LeanAngleTheme } from "./lean-angle/index.js";
import { LenaTheme } from "./lena/index.js";
import { LetterheadTheme } from "./letterhead/index.js";
import { LigneClaireTheme } from "./ligne-claire/index.js";
import { MatildaTheme } from "./matilda/index.js";
import { MinimalTheme } from "./minimal/index.js";
import { MonogramTheme } from "./monogram/index.js";
import { NeoBrutalTheme } from "./neo-brutal/index.js";
import { OnePagerTheme } from "./one-pager/index.js";
import { ProofOfWorkTheme } from "./proof-of-work/index.js";
import { QuarterlyTheme } from "./quarterly/index.js";
import { RibbonTheme } from "./ribbon/index.js";
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
    added: AliceTheme.meta.added,
    featured: AliceTheme.meta.featured,
    tags: AliceTheme.meta.tags
  },
  [AuroraTheme.meta.id]: {
    type: AuroraTheme,
    title: AuroraTheme.meta.title,
    description: AuroraTheme.meta.description,
    added: AuroraTheme.meta.added,
    featured: AuroraTheme.meta.featured,
    tags: AuroraTheme.meta.tags
  },
  [BentoTheme.meta.id]: {
    type: BentoTheme,
    title: BentoTheme.meta.title,
    description: BentoTheme.meta.description,
    added: BentoTheme.meta.added,
    featured: BentoTheme.meta.featured,
    tags: BentoTheme.meta.tags
  },
  [BlueprintTheme.meta.id]: {
    type: BlueprintTheme,
    title: BlueprintTheme.meta.title,
    description: BlueprintTheme.meta.description,
    added: BlueprintTheme.meta.added,
    featured: BlueprintTheme.meta.featured,
    tags: BlueprintTheme.meta.tags
  },
  [BoilingDieselTheme.meta.id]: {
    type: BoilingDieselTheme,
    title: BoilingDieselTheme.meta.title,
    description: BoilingDieselTheme.meta.description,
    added: BoilingDieselTheme.meta.added,
    featured: BoilingDieselTheme.meta.featured,
    tags: BoilingDieselTheme.meta.tags
  },
  [BusinessCasualTheme.meta.id]: {
    type: BusinessCasualTheme,
    title: BusinessCasualTheme.meta.title,
    description: BusinessCasualTheme.meta.description,
    added: BusinessCasualTheme.meta.added,
    featured: BusinessCasualTheme.meta.featured,
    tags: BusinessCasualTheme.meta.tags
  },
  [FjordTheme.meta.id]: {
    type: FjordTheme,
    title: FjordTheme.meta.title,
    description: FjordTheme.meta.description,
    added: FjordTheme.meta.added,
    featured: FjordTheme.meta.featured,
    tags: FjordTheme.meta.tags
  },
  [GnapTheme.meta.id]: {
    type: GnapTheme,
    title: GnapTheme.meta.title,
    description: GnapTheme.meta.description,
    added: GnapTheme.meta.added,
    featured: GnapTheme.meta.featured,
    tags: GnapTheme.meta.tags
  },
  [HoldenWreckTheme.meta.id]: {
    type: HoldenWreckTheme,
    title: HoldenWreckTheme.meta.title,
    description: HoldenWreckTheme.meta.description,
    added: HoldenWreckTheme.meta.added,
    featured: HoldenWreckTheme.meta.featured,
    tags: HoldenWreckTheme.meta.tags
  },
  [JavaBeanTheme.meta.id]: {
    type: JavaBeanTheme,
    title: JavaBeanTheme.meta.title,
    description: JavaBeanTheme.meta.description,
    added: JavaBeanTheme.meta.added,
    featured: JavaBeanTheme.meta.featured,
    tags: JavaBeanTheme.meta.tags
  },
  [LeanAngleTheme.meta.id]: {
    type: LeanAngleTheme,
    title: LeanAngleTheme.meta.title,
    description: LeanAngleTheme.meta.description,
    added: LeanAngleTheme.meta.added,
    featured: LeanAngleTheme.meta.featured,
    tags: LeanAngleTheme.meta.tags
  },
  [LenaTheme.meta.id]: {
    type: LenaTheme,
    title: LenaTheme.meta.title,
    description: LenaTheme.meta.description,
    added: LenaTheme.meta.added,
    featured: LenaTheme.meta.featured,
    tags: LenaTheme.meta.tags
  },
  [LetterheadTheme.meta.id]: {
    type: LetterheadTheme,
    title: LetterheadTheme.meta.title,
    description: LetterheadTheme.meta.description,
    added: LetterheadTheme.meta.added,
    featured: LetterheadTheme.meta.featured,
    tags: LetterheadTheme.meta.tags
  },
  [LigneClaireTheme.meta.id]: {
    type: LigneClaireTheme,
    title: LigneClaireTheme.meta.title,
    description: LigneClaireTheme.meta.description,
    added: LigneClaireTheme.meta.added,
    featured: LigneClaireTheme.meta.featured,
    tags: LigneClaireTheme.meta.tags
  },
  [MatildaTheme.meta.id]: {
    type: MatildaTheme,
    title: MatildaTheme.meta.title,
    description: MatildaTheme.meta.description,
    added: MatildaTheme.meta.added,
    featured: MatildaTheme.meta.featured,
    tags: MatildaTheme.meta.tags
  },
  [MinimalTheme.meta.id]: {
    type: MinimalTheme,
    title: MinimalTheme.meta.title,
    description: MinimalTheme.meta.description,
    added: MinimalTheme.meta.added,
    featured: MinimalTheme.meta.featured,
    tags: MinimalTheme.meta.tags
  },
  [MonogramTheme.meta.id]: {
    type: MonogramTheme,
    title: MonogramTheme.meta.title,
    description: MonogramTheme.meta.description,
    added: MonogramTheme.meta.added,
    featured: MonogramTheme.meta.featured,
    tags: MonogramTheme.meta.tags
  },
  [NeoBrutalTheme.meta.id]: {
    type: NeoBrutalTheme,
    title: NeoBrutalTheme.meta.title,
    description: NeoBrutalTheme.meta.description,
    added: NeoBrutalTheme.meta.added,
    featured: NeoBrutalTheme.meta.featured,
    tags: NeoBrutalTheme.meta.tags
  },
  [OnePagerTheme.meta.id]: {
    type: OnePagerTheme,
    title: OnePagerTheme.meta.title,
    description: OnePagerTheme.meta.description,
    added: OnePagerTheme.meta.added,
    featured: OnePagerTheme.meta.featured,
    tags: OnePagerTheme.meta.tags
  },
  [ProofOfWorkTheme.meta.id]: {
    type: ProofOfWorkTheme,
    title: ProofOfWorkTheme.meta.title,
    description: ProofOfWorkTheme.meta.description,
    added: ProofOfWorkTheme.meta.added,
    featured: ProofOfWorkTheme.meta.featured,
    tags: ProofOfWorkTheme.meta.tags
  },
  [QuarterlyTheme.meta.id]: {
    type: QuarterlyTheme,
    title: QuarterlyTheme.meta.title,
    description: QuarterlyTheme.meta.description,
    added: QuarterlyTheme.meta.added,
    featured: QuarterlyTheme.meta.featured,
    tags: QuarterlyTheme.meta.tags
  },
  [RibbonTheme.meta.id]: {
    type: RibbonTheme,
    title: RibbonTheme.meta.title,
    description: RibbonTheme.meta.description,
    added: RibbonTheme.meta.added,
    featured: RibbonTheme.meta.featured,
    tags: RibbonTheme.meta.tags
  },
  [StandardIssueTheme.meta.id]: {
    type: StandardIssueTheme,
    title: StandardIssueTheme.meta.title,
    description: StandardIssueTheme.meta.description,
    added: StandardIssueTheme.meta.added,
    featured: StandardIssueTheme.meta.featured,
    tags: StandardIssueTheme.meta.tags
  },
  [TerminalTheme.meta.id]: {
    type: TerminalTheme,
    title: TerminalTheme.meta.title,
    description: TerminalTheme.meta.description,
    added: TerminalTheme.meta.added,
    featured: TerminalTheme.meta.featured,
    tags: TerminalTheme.meta.tags
  },
  [TimelineTheme.meta.id]: {
    type: TimelineTheme,
    title: TimelineTheme.meta.title,
    description: TimelineTheme.meta.description,
    added: TimelineTheme.meta.added,
    featured: TimelineTheme.meta.featured,
    tags: TimelineTheme.meta.tags
  },
  [TimesTheme.meta.id]: {
    type: TimesTheme,
    title: TimesTheme.meta.title,
    description: TimesTheme.meta.description,
    added: TimesTheme.meta.added,
    featured: TimesTheme.meta.featured,
    tags: TimesTheme.meta.tags
  },
  [TypewriterTheme.meta.id]: {
    type: TypewriterTheme,
    title: TypewriterTheme.meta.title,
    description: TypewriterTheme.meta.description,
    added: TypewriterTheme.meta.added,
    featured: TypewriterTheme.meta.featured,
    tags: TypewriterTheme.meta.tags
  },
  [WinterTheme.meta.id]: {
    type: WinterTheme,
    title: WinterTheme.meta.title,
    description: WinterTheme.meta.description,
    added: WinterTheme.meta.added,
    featured: WinterTheme.meta.featured,
    tags: WinterTheme.meta.tags
  },
  [ZurichTheme.meta.id]: {
    type: ZurichTheme,
    title: ZurichTheme.meta.title,
    description: ZurichTheme.meta.description,
    added: ZurichTheme.meta.added,
    featured: ZurichTheme.meta.featured,
    tags: ZurichTheme.meta.tags
  }    
};
export default ThemeRegistry;

