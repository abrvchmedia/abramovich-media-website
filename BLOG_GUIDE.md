# Blog Management Guide

## How to Add a New Blog Post

To add a new blog post to your website, simply edit the `src/data/blog.ts` file.

### Step 1: Open the blog data file

```bash
src/data/blog.ts
```

### Step 2: Add your new blog post to the array

Copy this template and add it to the `blogPosts` array:

```typescript
{
  slug: "your-post-url-slug",
  title: "Your Blog Post Title",
  excerpt: "A short 1-2 sentence summary that appears on the blog listing page.",
  content: `
# Your Blog Post Title

Your full blog post content goes here. You can use:

## Headings

Like this!

### Subheadings

Even smaller headings.

## Lists

- Bullet point 1
- Bullet point 2
- Bullet point 3

## Paragraphs

Just write regular text. Line breaks will be preserved.

You can write multiple paragraphs like this.

## Links

[Link text](/pricing) or [External Link](https://example.com)

## Formatting

**Bold text** and *italic text* work too if you process markdown.
  `,
  author: "Your Name or Abramovich Media Team",
  date: "2025-10-11",  // Use YYYY-MM-DD format
  category: "Content Strategy",  // Any category you want
  image: "/path/to/image.jpg",  // Optional - leave out if no image
  readTime: "5 min read"  // Optional
}
```

### Step 3: Important Fields

- **slug**: The URL-friendly version of your title (use lowercase, hyphens, no spaces)
  - Example: "how-to-create-content" becomes `/blog/how-to-create-content`
- **title**: The main title of your post
- **excerpt**: Short summary (150-200 characters recommended)
- **content**: Full blog post content (can be multi-paragraph)
- **date**: Format as YYYY-MM-DD (newest posts appear first)
- **category**: Any category name you want

### Step 4: Deploy to Vercel

After adding your blog post:

```bash
cd "/Volumes/4TB T9/_Cursor_AI Web Design/abramovich-media"
git add src/data/blog.ts
git commit -m "Add new blog post: Your Title"
git push origin main
vercel --prod --yes
```

## Example Categories

- Content Strategy
- Video Production
- Brand Building
- Behind the Scenes
- Industry Insights
- Case Studies
- Tips & Tutorials

## Tips

1. **Keep slugs unique**: Each post needs a different slug
2. **Date format**: Always use YYYY-MM-DD for proper sorting
3. **Excerpt length**: Keep it under 200 characters for best display
4. **Content formatting**: Use `#` for headers, blank lines between paragraphs
5. **Images**: Place images in `/public/blog/` folder and reference as `/blog/image.jpg`

## Need Help?

The blog system automatically:
- Sorts posts by date (newest first)
- Generates individual post pages
- Creates proper meta tags for SEO
- Adds blog links to navigation
- Includes CTAs on each post

Just edit `src/data/blog.ts` and deploy - that's it! ✨

