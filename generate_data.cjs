const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'public', 'galery');

// Map main folders to categories. Default to 'Image / Art' if not specified otherwise.
const getCategoryInfo = (mainFolder) => {
  const map = {
    'Art': { category: 'Image / Art', subcategory: 'Traditional Art' },
    'Design': { category: 'Image / Art', subcategory: 'Graphic Design' },
    'GFX': { category: 'Image / Art', subcategory: 'GFX' },
    'Komik': { category: 'Image / Art', subcategory: 'Comic' },
    'Manipulation': { category: 'Image / Art', subcategory: 'Photo Manipulation' },
    'Photography': { category: 'Image / Art', subcategory: 'Photography' },
    'Render2D': { category: 'Image / Art', subcategory: '2D Render' },
    'Render3D': { category: 'Image / Art', subcategory: '3D Render' },
    'UI UX': { category: 'Image / Art', subcategory: 'UI/UX Design' },
    'Video': { category: 'Video', subcategory: 'Video' }
  };
  return map[mainFolder] || { category: 'Image / Art', subcategory: mainFolder };
};

let galleryItems = [];
let idCounter = 1;

function processDirectory(currentPath, relativePath) {
  const items = fs.readdirSync(currentPath);
  
  for (const item of items) {
    const fullPath = path.join(currentPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath, relativePath ? path.join(relativePath, item) : item);
    } else {
      const ext = path.extname(item).toLowerCase();
      // Only process media files
      if (!['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mkv', '.pdf'].includes(ext)) {
        continue;
      }
      
      const itemRelPath = relativePath ? path.join(relativePath, item) : item;
      const parts = itemRelPath.split(path.sep);
      const mainFolder = parts[0];
      
      let type = 'image';
      if (['.mp4', '.mkv'].includes(ext)) type = 'video';
      if (ext === '.pdf') type = 'document';
      
      const categoryInfo = getCategoryInfo(mainFolder);
      let subcategory = categoryInfo.subcategory;
      let title = path.basename(item, ext);
      
      // If the file is inside a subfolder of its main category, grab that subfolder name as the subcategory
      if (parts.length > 2) {
        // e.g., Video/anime/anime.mp4 -> subcategory = Anime
        subcategory = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        title = path.basename(item, ext);
      }

      let url = '/galery/' + itemRelPath.split(path.sep).join('/');
      
      let thumbnail = undefined;
      if (type === 'video') {
         thumbnail = '/galery/Art/art.png'; // Will fix later if there's a specific thumbnail policy
      }

      galleryItems.push({
        id: idCounter++,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        category: categoryInfo.category,
        subcategory: subcategory,
        type: type,
        url: url,
        ...(thumbnail && { thumbnail }),
        description: `Karya di kategori ${subcategory}.`
      });
    }
  }
}

// Start processing from root of public/galery
processDirectory(galleryDir, '');

console.log(`Found ${galleryItems.length} items in gallery.`);

const dataPath = path.join(__dirname, 'src', 'data.json');
const existingData = require('./src/data.json');

existingData.gallery = galleryItems;

fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
console.log('Successfully updated src/data.json.');
