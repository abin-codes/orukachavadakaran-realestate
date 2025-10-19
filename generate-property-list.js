const fs = require('fs');
const path = require('path');

// Path to properties folder
const propertiesFolder = path.join(__dirname, 'content', 'properties');
const outputFile = path.join(__dirname, 'content', 'property-list.json');

// Read all files in the properties folder
fs.readdir(propertiesFolder, (err, files) => {
  if (err) {
    console.error('Error reading properties folder:', err);
    process.exit(1);
  }

  // Filter only property JSON files and extract IDs
  const propertyIds = files
    .filter(file => file.startsWith('property-') && file.endsWith('.json'))
    .map(file => file.replace('property-', '').replace('.json', ''))
    .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically

  // Create the property list object
  const propertyList = {
    properties: propertyIds
  };

  // Write to property-list.json
  fs.writeFileSync(outputFile, JSON.stringify(propertyList, null, 2));
  
  console.log(`✅ Generated property-list.json with ${propertyIds.length} properties:`, propertyIds);
});
