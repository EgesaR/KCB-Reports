export type Blog = {
  id: string;
  title: string;
  description: string;
  author?: string;
  publishedAt: string;
  url: string;
  urlToImage?: string; // Add this line if your API provides it
};
