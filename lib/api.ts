import { z } from "zod";

const API_URL = "https://hacker-news.firebaseio.com/v0";

const topStoriesSchema = z.number().array();

export const getTopStories = async () => {
  const posts = await fetch(`${API_URL}/topstories.json`);
  const data = await posts.json();
  return topStoriesSchema.parse(data);
};

const itemSchema = z.object({
  id: z.number(),
  deleted: z.boolean().optional(),
  type: z.enum(["job", "story", "comment", "poll", "pollopt"]),
  by: z.string(),
  time: z.number(),
  text: z.string().optional(),
  dead: z.boolean().optional(),
  parent: z.number().optional(),
  poll: z.number().optional(),
  kids: z.array(z.number()).optional(),
  url: z.string().url().optional(),
  score: z.number().optional(),
  title: z.string().optional(),
  parts: z.array(z.number()).optional(),
  descendants: z.number().optional(),
});

export const getItem = async (id: number | string) => {
  const item = await fetch(`${API_URL}/item/${id}.json`);
  const data = await item.json();
  return itemSchema.parse(data);
};

const storySchema = z.object({
  by: z.string(),
  descendants: z.number(),
  id: z.number(),
  kids: z.array(z.number()),
  score: z.number(),
  time: z.number(),
  title: z.string(),
  type: z.literal("story"),
  url: z.string().url(),
});
