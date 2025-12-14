const fs = require('fs');
const path = 'public/feedback_qr_v2.png';
try {
    const bitmap = fs.readFileSync(path);
    const base64 = Buffer.from(bitmap).toString('base64');
    const content = `export const QR_CODE_BASE64 = "data:image/png;base64,${base64}";`;
    fs.writeFileSync('src/data/qrCode.ts', content);
    console.log('Success');
} catch (e) {
    console.error(e);
}
