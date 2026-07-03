import fs from 'fs';
const b = fs.readFileSync('test_resume.pdf').toString('base64');
(async ()=>{
  try {
    const res = await fetch('http://localhost:5000/resume/analyze-base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64: b }),
    });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (e) {
    console.error('ERR', e);
  }
})();
