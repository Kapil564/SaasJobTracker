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
      
      // bg-black/20 to bg-white
      content = content.replace(/bg-black\/[0-9]+/g, 'bg-white');
      
      // Fix background/border whites
      content = content.replace(/bg-white\/\[0\.0[0-9]\]/g, 'bg-slate-50');
      content = content.replace(/bg-white\/[0-9]+/g, 'bg-slate-100');
      content = content.replace(/border-white\/[0-9]+/g, 'border-slate-200');
      content = content.replace(/rgba\(255,255,255,0\.[0-9]+\)/g, 'rgba(15,23,42,0.1)');
      
      // Fix text whites, EXCLUDING text-white inside buttons which have accent background
      // Safe generic replace:
      content = content.replace(/text-white\/[0-9]+/g, 'text-slate-500');
      content = content.replace(/text-white(?!(\s+(bg-\[var|bg-slate-100|selection:)))/g, 'text-slate-900');
      content = content.replace(/text-white bg-\[var\(--accent/g, 'text-white bg-[var(--accent'); 
      content = content.replace(/text-slate-900 hover:text-white/g, 'text-slate-500 hover:text-slate-900');
      
      // Fix --bg-dark to --bg-dashboard
      content = content.replace(/--bg-dark/g, '--bg-dashboard');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  });
});
