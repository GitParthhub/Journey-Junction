const axios = require('axios');
const fs = require('fs');
const path = require('path');

class PhotoService {
  constructor() {
    // Using Unsplash API as a free alternative to Google Images
    this.unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || 'demo-key';
    this.baseURL = 'https://api.unsplash.com';
    this.imagesDir = path.join(__dirname, '../../images');
    
    // Ensure images directory exists
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true });
    }
  }

  /**
   * Search and download photos for a destination
   * @param {string} destination - The destination to search for
   * @param {number} count - Number of photos to download (default: 3)
   * @returns {Promise<Array>} Array of photo URLs
   */
  async getDestinationPhotos(destination, count = 3) {
    try {
      console.log(`Searching photos for destination: ${destination}`);
      
      // Clean destination name for search
      const searchQuery = this.cleanDestinationName(destination);
      
      // Try Unsplash first
      const unsplashPhotos = await this.searchUnsplashPhotos(searchQuery, count);
      if (unsplashPhotos.length > 0) {
        return unsplashPhotos;
      }
      
      // Fallback to Pixabay (free alternative)
      const pixabayPhotos = await this.searchPixabayPhotos(searchQuery, count);
      if (pixabayPhotos.length > 0) {
        return pixabayPhotos;
      }
      
      // Final fallback to default images
      return this.getDefaultImages(destination, count);
      
    } catch (error) {
      console.error('Error fetching destination photos:', error);
      return this.getDefaultImages(destination, count);
    }
  }

  /**
   * Search photos on Unsplash
   */
  async searchUnsplashPhotos(query, count) {
    try {
      const response = await axios.get(`${this.baseURL}/search/photos`, {
        params: {
          query: `${query} travel destination`,
          per_page: count,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${this.unsplashAccessKey}`
        },
        timeout: 10000
      });

      const photos = response.data.results.map(photo => ({
        url: photo.urls.regular,
        thumbnail: photo.urls.small,
        description: photo.description || photo.alt_description || `${query} destination`,
        photographer: photo.user.name,
        source: 'unsplash'
      }));

      return photos;
    } catch (error) {
      console.error('Unsplash API error:', error.message);
      return [];
    }
  }

  /**
   * Search photos on Pixabay (free alternative)
   */
  async searchPixabayPhotos(query, count) {
    try {
      const pixabayKey = process.env.PIXABAY_API_KEY || '44863-b8b8e5c7c6b8e5c7c6b8e5c7'; // Demo key
      
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: pixabayKey,
          q: `${query} travel destination`,
          image_type: 'photo',
          orientation: 'horizontal',
          category: 'places',
          per_page: count,
          safesearch: 'true'
        },
        timeout: 10000
      });

      const photos = response.data.hits.map(photo => ({
        url: photo.webformatURL,
        thumbnail: photo.previewURL,
        description: `${query} destination`,
        photographer: photo.user,
        source: 'pixabay'
      }));

      return photos;
    } catch (error) {
      console.error('Pixabay API error:', error.message);
      return [];
    }
  }

  /**
   * Get default images based on destination type
   */
  getDefaultImages(destination, count) {
    const destinationLower = destination.toLowerCase();
    
    // Destination-specific defaults
    const destinationDefaults = {
      'bali': ['/images/bali.webp', '/images/bali-2.jpg', '/images/bali-3.jpg'],
      'paris': ['/images/paris.webp', '/images/paris-2.jpg', '/images/paris-3.avif'],
      'beach': ['/images/beach.jpeg', '/images/kutabeach.jpeg', '/images/with-the-infinity-pool.jpg'],
      'mountain': ['/images/beautiful-girl-standing-boat-looking-mountains-ratchaprapha-dam-khao-sok-national-park-surat-thani-province-thailand_335224-849.avif'],
      'temple': ['/images/uluwatutemple.jpeg'],
      'rice': ['/images/Tegallalang Rice Terraces.webp']
    };

    // Check for specific destinations
    for (const [key, images] of Object.entries(destinationDefaults)) {
      if (destinationLower.includes(key)) {
        return images.slice(0, count).map(url => ({
          url,
          thumbnail: url,
          description: `${destination} destination`,
          photographer: 'Journey Junction',
          source: 'default'
        }));
      }
    }

    // Generic defaults
    const genericDefaults = [
      '/images/background.jpg',
      '/images/photo-1476514525535-07fb3b4ae5f1.avif',
      '/images/beautiful-girl-standing-boat-looking-mountains-ratchaprapha-dam-khao-sok-national-park-surat-thani-province-thailand_335224-849.avif'
    ];

    return genericDefaults.slice(0, count).map(url => ({
      url,
      thumbnail: url,
      description: `${destination} destination`,
      photographer: 'Journey Junction',
      source: 'default'
    }));
  }

  /**
   * Clean destination name for better search results
   */
  cleanDestinationName(destination) {
    return destination
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .split(',')[0] // Take only the first part if comma-separated
      .split(' ')[0]; // Take the first word for better results
  }

  /**
   * Download and save image locally (optional)
   */
  async downloadImage(imageUrl, filename) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'stream',
        timeout: 30000
      });

      const filepath = path.join(this.imagesDir, filename);
      const writer = fs.createWriteStream(filepath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(`/images/${filename}`));
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  /**
   * Get the best photo from a collection
   */
  getBestPhoto(photos) {
    if (!photos || photos.length === 0) return null;
    
    // Prefer Unsplash photos, then Pixabay, then defaults
    const unsplashPhotos = photos.filter(p => p.source === 'unsplash');
    if (unsplashPhotos.length > 0) return unsplashPhotos[0];
    
    const pixabayPhotos = photos.filter(p => p.source === 'pixabay');
    if (pixabayPhotos.length > 0) return pixabayPhotos[0];
    
    return photos[0];
  }
}

module.exports = new PhotoService();