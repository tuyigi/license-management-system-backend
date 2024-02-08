import { generateLicense } from './generate-license-pdf.utils';
import * as process from 'process';

export async function generateQrCode(license) {
  const QRCode = require('qrcode');
  await QRCode.toFile(
    `C:/Users/gtuyishime/Documents/Projects/BRD - License Management System Project/license-management-system/src/assets/qrcodes/${license.license_number}.png`,
    `${process.env.LOCAL_LINK}${license.license_number}`,
    {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      color: {
        dark: '#a47d30', // Blue dots
        light: '#0000', // Transparent background
      },
    },
    function (err) {
      if (err) throw err;
      const path = `./src/assets/licenses/${license.license_number}.pdf`;
      generateLicense(license, path);
    },
  );
}
