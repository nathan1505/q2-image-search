const axios = require("axios");

// Base URLs and API keys for 3rd-party services
const UNSPLASH_URL = "https://api.unsplash.com/search/photos";
const PIXABAY_URL = "https://pixabay.com/api/";
const STORYBLOCKS_URL = "https://api.storyblocks.com/v2/images/search";

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const STORYBLOCKS_API_KEY = process.env.STORYBLOCKS_API_KEY;

// Fetch images from Unsplash
const fetchUnsplashImages = async (query) => {
  try {
    const response = await axios.get(UNSPLASH_URL, {
      headers: { Authorization: `Client-ID ${UNSPLASH_API_KEY}` },
      params: { query, per_page: 5 },
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

// Fetch images from Pixabay
const fetchPixabayImages = async (query) => {
  try {
    const response = await axios.get(PIXABAY_URL, {
      params: { key: PIXABAY_API_KEY, q: query, per_page: 5 },
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

// Fetch images from Storyblocks
const fetchStoryblocksImages = async (query) => {
  try {
    const response = await axios.get(STORYBLOCKS_URL, {
      headers: { Authorization: `Bearer ${STORYBLOCKS_API_KEY}` },
      params: { query, per_page: 5 },
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

// Main controller to handle the image fetch request
const getImages = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Please provide a search query." });
  }

  try {
    // Trigger all API calls simultaneously
    const [unsplashImages, pixabayImages, storyblocksImages] = await Promise.all([
      fetchUnsplashImages(query),
      fetchPixabayImages(query),
      fetchStoryblocksImages(query),
    ]);

    // Merge results
    const allImages = [...unsplashImages, ...pixabayImages, ...storyblocksImages];

    // Respond to user
    res.json({
      query,
      results: allImages,
      total_results: allImages.length,
    });
  } catch (error) {
    console.error("Error in getImages controller:", error.message);
    res.status(500).json({ error: "An error occurred while fetching images." });
  }
};

module.exports = { getImages };
