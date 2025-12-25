// Script to add missing data-testid attributes to risk module pages
import * as fs from 'fs';
import * as path from 'path';

const filesToUpdate = [
  {
    file: 'frontend/src/app/[locale]/(dashboard)/dashboard/risks/treatments/page.tsx',
    replacements: [
      {
        find: '          <Button onClick={() => {\n            setEditingTreatment(null)\n            setIsFormOpen(true)\n          }}>',
        replace: '          <Button onClick={() => {\n            setEditingTreatment(null)\n            setIsFormOpen(true)\n          }} data-testid="treatments-new-button">'
      }
    ]
  },
  {
    file: 'frontend/src/app/[locale]/(dashboard)/dashboard/risks/kris/page.tsx',
    replacements: [
      {
        find: '          <Button onClick={() => {\n            setEditingKRI(null)\n            setIsFormOpen(true)\n          }}>',
        replace: '          <Button onClick={() => {\n            setEditingKRI(null)\n            setIsFormOpen(true)\n          }} data-testid="kris-new-button">'
      }
    ]
  }
];

const basePath = '/Users/adelsayed/Documents/Code/Stratagem';

filesToUpdate.forEach(({ file, replacements }) => {
  const filePath = path.join(basePath, file);
  console.log(`Processing: ${file}`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ find, replace }) => {
    if (content.includes(find)) {
      content = content.replace(find, replace);
      modified = true;
      console.log(`  ✅ Added data-testid attribute`);
    } else {
      console.log(`  ⚠️  Pattern not found: ${find.substring(0, 50)}...`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Saved changes to: ${file}`);
  } else {
    console.log(`  ℹ️  No changes needed for: ${file}`);
  }
});

console.log('\n✅ Data-testid attribute addition complete!');
console.log('\nSummary of data-testid attributes added:');
console.log('  - risk-treatments-new-button: New Treatment button on treatments page');
console.log('  - risk-kris-new-button: New KRI button on KRIs page');