import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

const backendDir = path.resolve('..', 'backend');
const testPath = path.join(process.cwd(), 'test_resume.pdf');

fs.writeFileSync(testPath, '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (Test Resume) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000061 00000 n \n0000000117 00000 n \n0000000226 00000 n \n0000000311 00000 n \ntrailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n368\n%%EOF');

const form = new FormData();
form.append('resume', fs.createReadStream(testPath));

const url = 'http://localhost:5000/resume/analyze';

const run = async () => {
  const res = await fetch(url, { method: 'POST', body: form, headers: form.getHeaders() });
  console.log('status', res.status);
  const body = await res.text();
  console.log('body', body);
};

run().catch((err) => {
  console.error('ERROR', err);
});
