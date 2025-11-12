/**
 * Kill process on port 5000
 * Usage: node scripts/kill-port.js [port]
 */

const { exec } = require('child_process');
const port = process.argv[2] || '5000';

console.log(`🔍 Finding process on port ${port}...`);

// Windows command to find process
exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
  if (error) {
    console.log(`❌ No process found on port ${port}`);
    return;
  }

  const lines = stdout.trim().split('\n');
  const pids = new Set();

  lines.forEach(line => {
    const parts = line.trim().split(/\s+/);
    if (parts.length > 0) {
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        pids.add(pid);
      }
    }
  });

  if (pids.size === 0) {
    console.log(`❌ No process found on port ${port}`);
    return;
  }

  console.log(`\n📋 Found ${pids.size} process(es) on port ${port}:`);
  pids.forEach(pid => console.log(`   PID: ${pid}`));

  console.log(`\n🛑 Killing process(es)...`);

  pids.forEach(pid => {
    exec(`taskkill /PID ${pid} /F`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to kill PID ${pid}:`, error.message);
      } else {
        console.log(`✅ Killed PID ${pid}`);
      }
    });
  });

  console.log(`\n💡 Wait a moment, then try: npm run dev`);
});

