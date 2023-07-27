import { z } from "zod";

const HACKER_NEWS_API_URL = "https://hacker-news.firebaseio.com/v0";
const SEARCH_API_URL = "https://hn.algolia.com/api/v1";

const topStoriesSchema = z.number().array();

export const getTopStories = async () => {
  const posts = await fetch(`${HACKER_NEWS_API_URL}/topstories.json`);
  const data = await posts.json();
  return topStoriesSchema.parse(data);
};

const itemSchema = z.object({
  id: z.number(),
  deleted: z.boolean().optional(),
  type: z.enum(["job", "story", "comment", "poll", "pollopt"]),
  by: z.string().optional(),
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
  const item = await fetch(`${HACKER_NEWS_API_URL}/item/${id}.json`);
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

type SearchTag =
  | "story"
  | "comment"
  | "poll"
  | "pollopt"
  | "show_hn"
  | "ask_hn"
  | "front_page"
  | `author_${string}`
  | `story_${string}`;

type NumericCondition = "<" | "<=" | "=" | ">" | ">=";
type NumericField = "created_at_i" | "points" | "num_comments";
type NumericFilter = [NumericField, NumericCondition, number];

type SearchQueryParams = {
  // full-text query
  query?: string;
  // filter on a specific tag
  tags?: SearchTag | SearchTag[];
  // filter on a specific numerical condition (<, <=, =, > or >=).
  numericFilters?: NumericFilter;
  // page number
  page?: number;
};

const searchQueryParamsToString = (params: SearchQueryParams) => {
  const { query, tags, numericFilters, page } = params;
  const queryParts = [];
  if (query) {
    queryParts.push(`query=${query}`);
  }
  if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : [tags];
    queryParts.push(`tags=${tagsArray.join(",")}`);
  }
  if (numericFilters) {
    const numericFiltersString = numericFilters.join("");
    queryParts.push(`numericFilters=${numericFiltersString}`);
  }
  if (page) {
    queryParts.push(`page=${page}`);
  }
  return queryParts.join("&");
};

export const search = async (params: SearchQueryParams) => {
  const query = searchQueryParamsToString(params);
  const posts = await fetch(`${SEARCH_API_URL}/search?${query}`);
  const data = await posts.json();
  return searchResultSchema.parse(data);
};

export const searchByDate = async (params: SearchQueryParams) => {
  const query = searchQueryParamsToString(params);
  const posts = await fetch(`${SEARCH_API_URL}/search_by_date?${query}`);
  const data = await posts.json();
  return searchResultSchema.parse(data);
};

const hitsSchema = z.object({
  created_at: z.string(),
  title: z.string(),
  url: z.string().url().nullable(),
  author: z.string(),
  points: z.number(),
  story_text: z.string().nullable(),
  comment_text: z.string().nullable(),
  num_comments: z.number(),
  story_id: z.number().nullable(),
  story_title: z.string().nullable(),
  story_url: z.string().nullable(),
  parent_id: z.number().nullable(),
  created_at_i: z.number(),
  relevancy_score: z.number().optional(),
  _tags: z.array(z.string()),
  objectID: z.string(),
  _highlightResult: z.object({
    title: z.object({
      value: z.string(),
      matchLevel: z.enum(["none", "partial", "full"]),
      fullyHighlighted: z.boolean().optional(),
      matchedWords: z.array(z.string()),
    }),
    url: z.object({
      value: z.string(),
      matchLevel: z.enum(["none", "partial", "full"]),
      matchedWords: z.array(z.string()),
    }).optional(),
    author: z.object({
      value: z.string(),
      matchLevel: z.enum(["none", "partial", "full"]),
      matchedWords: z.array(z.string()),
    }),
  }),
});

const searchResultSchema = z.object({
  hits: z.array(hitsSchema),
  nbHits: z.number(),
  page: z.number(),
  nbPages: z.number(),
  hitsPerPage: z.number(),
  exhaustiveNbHits: z.boolean(),
  exhaustiveTypo: z.boolean(),
  exhaustive: z.object({
    nbHits: z.boolean(),
    typo: z.boolean(),
  }),
  query: z.string(),
  params: z.string(),
  processingTimeMS: z.number(),
  processingTimingsMS: z.object({
    afterFetch: z
      .object({
        total: z.number(),
      })
      .optional(),
    fetch: z
      .object({
        query: z.number().optional(),
        scanning: z.number().optional(),
        total: z.number(),
      })
      .optional(),
    request: z.object({
      roundTrip: z.number(),
    }),
    total: z.number(),
  }),
  serverTimeMS: z.number(),
});

const commentSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  author: z.string().nullable(),
  text: z.string().nullable(),
  points: z.number().nullable(),
  parent_id: z.number().nullable(),
});

type Comment = z.infer<typeof commentSchema> & {
  children: Comment[];
};

const recursiveCommentSchema: z.ZodType<Comment> = commentSchema.extend({
  children: z.lazy(() => z.array(recursiveCommentSchema)),
});

const postSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  author: z.string(),
  title: z.string(),
  url: z.string(),
  text: z.string().nullable(),
  points: z.number(),
  parent_id: z.number().nullable(),
  children: z.array(recursiveCommentSchema),
});

export const getItemV1 = async (id: string) => {
  const item = await fetch(`${SEARCH_API_URL}/items/${id}`);
  const data = await item.json();
  return postSchema.parse(data);
};
