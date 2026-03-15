const photoService = require('./services/photoService');

async function testPhotoService() {
  console.log('Testing Photo Service...\n');
  
  const destinations = ['Bali', 'Paris', 'Tokyo', 'New York', 'London'];
  
  for (const destination of destinations) {
    console.log(`\n🔍 Searching photos for: ${destination}`);
    try {
      const photos = await photoService.getDestinationPhotos(destination, 2);
      console.log(`✅ Found ${photos.length} photos:`);
      
      photos.forEach((photo, index) => {
        console.log(`  ${index + 1}. ${photo.description} (${photo.source})`);
        console.log(`     URL: ${photo.url.substring(0, 60)}...`);
      });
      
      const bestPhoto = photoService.getBestPhoto(photos);
      if (bestPhoto) {
        console.log(`⭐ Best photo: ${bestPhoto.description} from ${bestPhoto.source}`);
      }
    } catch (error) {
      console.error(`❌ Error for ${destination}:`, error.message);
    }
  }
  
  console.log('\n✨ Photo service test completed!');
}

// Run the test
testPhotoService().catch(console.error);