// src/oem/oem-quotes/oem-quotes.service.ts:127
// exportPdf

const chartLabels = [];
for (let i = 1; i <= maxTerm; i++) {
  chartLabels.push(
    `${Object.keys(termTypes).find(
      (key) => termTypes[key] === maxTermType,
    )} ${i}`,
  );
}

//const chartValues = quotesProducts.map()
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const date = new Date(quote.createdAt);
let imageBuffer;
try {
  imageBuffer = await this.pdfMerger.getFile(quote.company.logoUrl);
} catch (e) {
  console.error(e);
}
const pdfDoc: Buffer = await this.pdfExporter.generatePDF({
  mainData: {
    customer: {},
    title: quote.quoteName,
    uuid: quote.quoteUuid,
    date:
      monthNames[date.getMonth()] +
      ' ' +
      date.getDate() +
      ', ' +
      date.getFullYear(),
    imageBuffer: imageBuffer,
  },
  chartData: {
    labels: chartLabels,
    values: [
      [12, 3, 5],
      [4, 6, 10],
    ],
  },
  tableData: {
    values: [
      {
        productName: 'Virtual Apps & Desktops Service Premium CCU',
        quantity: 300,
        term: 3,
        termType: 'Year',
        totalSRP: '600,201',
        totalDiscount: '80',
        totalPSRP: '360,120',
        annualPSRP: '120,040',
        perLicense: '400',
      },
      {
        productName: 'BAU',
        quantity: 300,
        term: 3,
        termType: 'Year',
        totalSRP: '144,600',
        totalDiscount: '50',
        totalPSRP: '72,300',
        annualPSRP: '24,100',
        perLicense: '80',
      },
    ],
  },
});
const mergedMaterialsPDF = await this.pdfMerger.downloadAndMerge(
  materials.map((material) => material.fileUrl),
);

const mergedPDF = await this.pdfMerger.merge([pdfDoc, mergedMaterialsPDF]);
fs.writeFile('./output.pdf', mergedPDF, function (err) {
  // If an error occurred, show it and return
  if (err) return console.error(err);
  // Successfully wrote binary contents to the file!
});
const pathFilename = this.filenameGenerator.generateRandomName('PDF');
const aYearFromNow = new Date();
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
await this.uploader.putSignUrl({
  ContentType: 'PDF',
  Bucket: this.bucketName,
  Key: pathFilename,
  Body: mergedPDF,
  Expires: aYearFromNow,
});
const uploadURL = await this.uploader.getSignUrl({
  Bucket: this.bucketName,
  ContentType: 'PDF',
  Key: pathFilename,
});
await this.repo.update({ quoteId: quoteId }, { pdfFileUrl: uploadURL });
return uploadURL;
