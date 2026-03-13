export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  keywords: string[];
  sectionTitle: string;
  metaDescription: string;
  sections: BlogSection[];
  cta: {
    heading: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
  };
};
