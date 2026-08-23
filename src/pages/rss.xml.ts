import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const entries = (await getCollection('writing')).sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
  return rss({
    title: 'Azeez Hamzat: Writing',
    description: 'Essays and field notes on collective intelligence, AI, knowledge systems, agriculture, and academic life.',
    site: context.site,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.published,
      link: `/writing/${entry.id}/`,
      categories: entry.data.tags,
    })),
    customData: '<language>en-gb</language>',
  });
}
