const fs = require("fs");
const PDFDocument = require("pdfkit");

export function generateLicense(license, path) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.image('./src/assets/internal/bg.jpg', 0, 0, { width: 600, height: 850 });
  generateHeader(doc, license);
  generateCustomerInformation(doc, license);
  generateFooter(doc);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc, license) {
  doc
    .image('./src/assets/internal/logo_bnr.png', 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(15)
    .text('National Bank of Rwanda\n', 110, 57)
    .fontSize(10)
    .text(`Certificate ${license.license_number}`, 110, 75)
    .fontSize(10)
    .text(`${license.organization_name}`, 200, 50, { align: 'right' })
    .text(`${license.organization_address}`, 200, 65, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(doc, license) {
  // add company details
  const customerInformationTop = 180;
  doc
    .fontSize(10)
    .text('KN Avenue 4 P.O Box 531 Kigali, Rwanda', 50, customerInformationTop)
    .font('Helvetica')
    .text(
      'has been assessed and certified as meeting the requirement',
      50,
      customerInformationTop + 10,
    )
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(`${license.license_number}`, 50, customerInformationTop + 30)
    .fontSize(10)
    .font('Helvetica')
    .text(formatDate(new Date()), 50, customerInformationTop + 55)
    .text('For the following activities', 50, customerInformationTop + 70)
    .text(`${license.license_description}`, 50, customerInformationTop + 85)
    .moveDown();

  const certificateValidity = 400;
  doc
    .font('Helvetica')
    .fontSize(10)
    .text(
      `This certificate is valid from ${license.start_date} until ${license.expiry_date} and remains valid subject to satisfactory survlillience audits.`,
      50,
      certificateValidity,
    )
    .text(
      'Certified activities performed by additional are listed on subsequent pages.',
      50,
      certificateValidity + 40,
    )
    .moveDown();

  // add signature

  const signatureDetailsTop = 530;

  generateHrDynamic(doc, signatureDetailsTop, 150);
  doc
    .font('Helvetica')
    .fontSize(10)
    .text('Assessed By', 50, signatureDetailsTop + 15)
    .text(`${license.approved_by}`, 50, signatureDetailsTop + 30)
    .text('License Manager', 50, signatureDetailsTop + 45)
    .moveDown();

  // add partners logo

  const partnerLogoTop = 620;
  doc
    .image('./src/assets/internal/imf.png', 50, partnerLogoTop, {
      width: 80,
      borderRadius: '20px 20px 20px 20px',
    })
    .fillColor('#444444')
    .image(
      `./src/assets/qrcodes/${license.license_number}.png`,
      470,
      partnerLogoTop,
      {
        width: 70,
      },
    )
    .fillColor('#444444')
    .font('Helvetica-Bold')
    .text('Scan for validity', 50, partnerLogoTop + 75, { align: 'right' });
}

function generateFooter(doc) {
  doc
    .font('Helvetica')
    .fontSize(10)
    .text(
      'Issued by BNR, If found please return to BNR nearest branch',
      50,
      760,
      { align: 'center', width: 500 },
    );
}

function generateHrDynamic(doc, y, x) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(x, y).stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return year + '/' + month + '/' + day;
}
