const fs = require('fs');
const path = require('path');

const imgPath = path.resolve(__dirname, 'public/feedback_qr_v2.png');
const outPath = path.resolve(__dirname, 'src/data/qrCode.ts');

console.log('CWD:', process.cwd());
console.log('Reading from:', imgPath);
console.log('Writing to:', outPath);

try {
    if (!fs.existsSync(imgPath)) {
        console.error('ERROR: Image file not found at', imgPath);
        process.exit(1);
    }
    const bitmap = fs.readFileSync(imgPath);
    const base64 = Buffer.from(bitmap).toString('base64');
    // NOTE: Prepending data:image/png;base64,
    const content = `export const QR_CODE_BASE64 = "data:image/png;base64,${base64}";`;

    fs.writeFileSync(outPath, content);
    console.log('Success: Wrote ' + content.length + ' bytes.');
} catch (e) {
    console.error('EXCEPTION:', e);
}
