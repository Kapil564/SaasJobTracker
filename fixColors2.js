const fs = require('fs');
const path = require('path');

const directories = [
  'client/src/components/dashboard',
  'client/src/pages'
];

const filesToUpdate = [
  'Sidebar.jsx', 'Topbar.jsx', 'StatsRow.jsx', 'RightPanel.jsx',
  'Toast.jsx', 'JobCard.jsx', 'KanbanBoard.jsx', 'AddJobModal.jsx',
  'Dashboard.jsx'
];

directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) return;
  
  const files = fs.readdirSync(fullPath);
  files.forEach(file => {
    if (filesToUpdate.includes(file)) {
      const filePath = path.join(fullPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix buttons with purple background
      content = content.replace(/bg-\[var\(--accent-purple\)\] text-slate-900/g, 'bg-[var(--accent-purple)] text-white');
      
      // Fix Sidebar logo text
      content = content.replace(/text-slate-900"\s*\/>\s*<\/div>/g, 'text-white" />\n        </div>');
      content = content.replace(/className="text-slate-900"\s*\/>/g, 'className="text-white" />');
      
      // Fix Sidebar avatar text
      content = content.replace(/text-slate-900 shadow-md/g, 'text-white shadow-md');
      
      // Fix JobCard logo text inside the card
      content = content.replace(/text-slate-500 shadow-inner group-hover\/card:bg-slate-100/g, 'text-white shadow-inner group-hover/card:bg-slate-100');
      
      // Job card logo text
      content = content.replace(/font-bold text-lg text-slate-500 shadow-inner/g, 'font-bold text-lg text-white shadow-inner');
      
      // Fix AddJobModal Save button text
      content = content.replace(/text-slate-900 bg-\[var\(--accent-purple\)\]/g, 'text-white bg-[var(--accent-purple)]');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Reverted ${file}`);
    }
  });
});
