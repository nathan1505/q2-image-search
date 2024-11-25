const axios = require("axios");

const UNSPLASH_URL = "https://api.unsplash.com/search/photos";
const PIXABAY_URL = "https://pixabay.com/api/";
const STORYBLOCKS_URL = "https://api.storyblocks.com/v2/images/search";

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const STORYBLOCKS_API_KEY = process.env.STORYBLOCKS_API_KEY;

const fetchUnsplashImages = async (query) => {
  try {
    const response = await axios.get(UNSPLASH_URL, {
      headers: { Authorization: `Client-ID ${UNSPLASH_API_KEY}` },
      params: { query, per_page: 10 },
    });
    return response.data.results.map((img) => ({
      image_ID: img.id,
      thumbnails: img.urls.thumb,
      preview: img.urls.regular,
      title: img.alt_description || "Untitled",
      source: "Unsplash",
      tags: img.tags?.map((tag) => tag.title) || [],
    }));
  } catch (error) {
    console.error("Error fetching Unsplash images:", error.message);
    return [];
  }
};

const fetchPixabayImages = async (query) => {
  try {
    const response = await axios.get(PIXABAY_URL, {
      params: { key: PIXABAY_API_KEY, q: query, per_page: 10 },
    });
    return response.data.hits.map((img) => ({
      image_ID: img.id,
      thumbnails: img.previewURL,
      preview: img.largeImageURL,
      title: img.tags || "Untitled",
      source: "Pixabay",
      tags: img.tags.split(",").map((tag) => tag.trim()),
    }));
  } catch (error) {
    console.error("Error fetching Pixabay images:", error.message);
    return [];
  }
};

const fetchStoryblocksImages = async (query) => {
  try {
    const response = await axios.get(STORYBLOCKS_URL, {
      headers: { Authorization: `Bearer ${STORYBLOCKS_API_KEY}` },
      params: { query, per_page: 10 },
    });
    return response.data.data.map((img) => ({
      image_ID: img.id,
      thumbnails: img.thumbnails[0]?.url || "",
      preview: img.assets[0]?.url || "",
      title: img.title || "Untitled",
      source: "Storyblocks",
      tags: img.keywords || [],
    }));
  } catch (error) {
    console.error("Error fetching Storyblocks images:", error.message);
    return [];
  }
};

const getImages = async (query) => {
  const [unsplashImages, pixabayImages, storyblocksImages] = await Promise.all([
    fetchUnsplashImages(query),
    fetchPixabayImages(query),
    fetchStoryblocksImages(query),
  ]);

  return [...unsplashImages, ...pixabayImages, ...storyblocksImages];
};

module.exports = { getImages };
