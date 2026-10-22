import Person from "./person.js";
import { IconFactory } from "./icons.js";
import { linkText, normalizeArray } from "./utils.js";

/** One contact link of a Person, with everything a theme needs to show it. */
export type ContactLink = {
  /** The link itself: `mailto:…`, `tel:…` or a URL. */
  href: string;
  /** The link as text, without protocol or a leading "www.". Never truncated. */
  text: string;
  /** What the link is, for example "Email" or "GitHub", for a link that shows only its icon. */
  label: string;
  /** The icon of the link, as inline SVG. */
  icon: string;
};

/**
 * The contact links of a Person, in the order every theme shows them: email, phone, website, then
 * the other profiles (`sameAs`) as they are listed. Themes render these in their own markup.
 */
export const contactLinks = (person: Person): Array<ContactLink> => {
  const iconFactory = new IconFactory(person);
  const { email, telephone, url, sameAs } = person;
  return normalizeArray(
    email ? `mailto:${email}` : undefined,
    telephone ? `tel:${telephone}` : undefined,
    url,
    sameAs
  ).map((href: string) => ({
    href,
    text: linkText(href),
    label: iconFactory.label(href),
    icon: iconFactory.icon(href)
  }));
};
