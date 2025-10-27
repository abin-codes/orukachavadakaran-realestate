const fs = require('fs');
const path = require('path');

// Path to blogs folder and output list file
const blogsFolder = path.join(__dirname, 'content', 'blogs');
const outputFile = path.join(__dirname, 'content', 'blog-list.json');

// Read all files in the blogs folder
fs.readdir(blogsFolder, (err, files) => {
  if (err) {
    console.error('Error reading blogs folder:', err);
    process.exit(1);
  }

  // Filter only JSON files and extract base name (can use file itself)
  const blogFiles = files
    .filter(file => file.endsWith('.json'))
    .sort(); // can sort by filename or add your date-based logic

  // Write to blog-list.json
  fs.writeFileSync(outputFile, JSON.stringify({ blogs: blogFiles }, null, 2));

  console.log(`✅ Generated blog-list.json with ${blogFiles.length} blogs:`, blogFiles);
});
