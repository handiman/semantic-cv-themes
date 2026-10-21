// Persons for tests that render whole pages. A theme receives a Person that semantic-cv-core has
// normalized and escaped, so these are written the way core hands them over: the ampersand in
// "R&amp;D" is already escaped, and every list is an array.

/** A Person with every field a theme can show. */
export const fullPerson = {
  "@type": "Person",
  name: "Ada Lindqvist",
  jobTitle: "Senior Backend Developer",
  workLocation: { "@type": "Place", name: "Stockholm, Sweden" },
  description:
    "Backend developer who likes small, well-tested services and plain-spoken documentation.",
  image: "https://example.com/ada.jpg",
  url: "https://ada.example.com/",
  email: "ada@example.com",
  telephone: "+46 70 123 45 67",
  sameAs: [
    "https://github.com/ada-lindqvist",
    "https://www.linkedin.com/in/ada-lindqvist",
    "https://stackoverflow.com/users/1/ada",
    "https://blog.example.org/ada"
  ],
  knowsAbout: ["Distributed systems", "API design", "Observability"],
  skills: ["C#", "TypeScript", "PostgreSQL"],
  knowsLanguage: ["Swedish", "English"],
  worksFor: [
    {
      "@type": "Role",
      roleName: "Tech Lead",
      startDate: "2022-03",
      description: "Led a team of five building the payments platform.",
      keywords: [
        { "@type": "DefinedTerm", name: "Kafka" },
        { "@type": "DefinedTerm", name: "Kubernetes" }
      ],
      worksFor: { "@type": "Organization", name: "Nordpay R&amp;D", location: "Göteborg" }
    },
    {
      "@type": "Role",
      roleName: "Developer",
      startDate: "2017-08",
      endDate: "2022-02",
      worksFor: {
        "@type": "Organization",
        name: "Example AB",
        location: { "@type": "PostalAddress", addressLocality: "Stockholm", addressCountry: "SE" }
      }
    },
    {
      "@type": "Role",
      roleName: "Maintainer",
      startDate: "2020-01",
      description: "Open-source command line tool.",
      keywords: [{ "@type": "DefinedTerm", name: "Node.js" }],
      worksFor: { "@type": "Project", name: "Rocket" }
    }
  ],
  alumniOf: [
    {
      "@type": "Role",
      roleName: "MSc Computer Science",
      startDate: "2012-09",
      endDate: "2017-06",
      alumniOf: { "@type": "EducationalOrganization", name: "KTH Royal Institute of Technology" }
    }
  ],
  hasCertification: [{ "@type": "Certification", name: "Azure Developer Associate" }],
  hasCredential: [{ "@type": "EducationalOccupationalCredential", name: "Scrum Master" }],
  lifeEvent: [
    {
      "@type": "Event",
      name: "Talk at Stockholm .NET User Group",
      startDate: "2024-11-12",
      location: { "@type": "Place", name: "Stockholm" },
      description: "Twenty minutes on outbox patterns."
    }
  ]
};

/** A Person with nothing but a name. */
export const nameOnlyPerson = { "@type": "Person", name: "Ada Lindqvist" };
