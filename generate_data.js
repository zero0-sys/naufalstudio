const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'public', 'galery');

const categoriesMap = {
  'Art': { category: 'Image / Art', subcategory: 'Traditional Art' },
  'Design': { category: 'Image / Art', subcategory: 'Graphic Design' },
  'GFX': { category: 'Image / Art', subcategory: 'GFX' },
  'Komik': { category: 'Image / Art', subcategory: 'Comic' },
  'Manipulation': { category: 'Image / Art', subcategory: 'Photo Manipulation' },
  'Photography': { category: 'Image / Art', subcategory: 'Photography' },
  'Render2D': { category: 'Image / Art', subcategory: '2D Render' },
  'Render3D': { category: 'Image / Art', subcategory: '3D Render' },
  'UI UX': { category: 'Image / Art', subcategory: 'UI/UX Design' },
  'Video': { category: 'Video', subcategory: 'General' } // Video has subfolders usually
};

let galleryItems = [];
let idCounter = 1;

function processDirectory(currentPath, basePath) {
  const items = fs.readdirSync(currentPath);
  
  for (const item of items) {
    const fullPath = path.join(currentPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath, path.join(basePath, item));
    } else {
      // It's a file
      const ext = path.extname(item).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mkv', '.pdf'].includes(ext)) {
        continue;
      }
      
      const relativePath = path.join(basePath, item); // e.g. Art/art.png
      const parts = relativePath.split(path.sep);
      const mainFolder = parts[0];
      
      let type = 'image';
      if (['.mp4', '.mkv'].includes(ext)) type = 'video';
      if (ext === '.pdf') type = 'document';
      
      let categoryInfo = categoriesMap[mainFolder] || { category: 'Files', subcategory: mainFolder };
      
      let subcategory = categoryInfo.subcategory;
      if (mainFolder === 'Video' && parts.length > 2) {
        // e.g. Video/anime/anime.mp4 -> subcategory = anime
        subcategory = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      }
      
      let title = path.basename(item, ext);
      
      let url = '/galery/' + relativePath.split(path.sep).join('/');
      
      let thumbnail = undefined;
      if (type === 'video') {
         // for videos we need a thumbnail. let's just pick one or set a default.
         thumbnail = '/galery/Art/art.png'; // Will try to improve this later
      }

      galleryItems.push({
        id: idCounter++,
        title: title,
        category: categoryInfo.category,
        subcategory: subcategory,
        type: type,
        url: url,
        thumbnail: thumbnail,
        description: `Artwork in ${subcategory} category.`
      });
    }
  }
}

processDirectory(galleryDir, '');

console.log(`Found ${galleryItems.length} items.`);

const dataPath = path.join(__dirname, 'src', 'data.json');
const existingData = require('./src/data.json');

existingData.gallery = galleryItems;

fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
console.log('Updated src/data.json');

