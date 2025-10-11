export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image?: string;
  readTime?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "welcome-to-our-blog",
    title: "Welcome to the Abramovich Media Blog",
    excerpt: "We're excited to share insights, tips, and stories about content creation, cinematography, and building your brand authority.",
    content: `
# Welcome to the Abramovich Media Blog

We're thrilled to launch our blog where we'll be sharing valuable insights about:

## What You'll Find Here

- **Content Strategy**: Tips on building a content engine that scales
- **Cinematography Techniques**: Behind-the-scenes looks at our production process
- **Brand Building**: How to turn your expertise into undeniable authority
- **Industry Insights**: Trends and best practices in video production

## Our Mission

At Abramovich Media, we believe that obsessive talent deserves a platform that matches their dedication. This blog is part of that mission—helping you understand how professional content creation can transform your business.

## Stay Tuned

We'll be publishing new content regularly. Whether you're a coach, consultant, local business, or national brand, you'll find actionable insights to elevate your content game.

Ready to get started? [Check out our pricing](/pricing) or [contact us](/contact) to discuss your project.
    `,
    author: "Abramovich Media Team",
    date: "2025-10-11",
    category: "Company News",
    readTime: "3 min read"
  }
];

