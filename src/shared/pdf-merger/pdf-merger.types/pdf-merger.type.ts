import { PDFDocument } from 'pdf-lib';

export interface PDFDocumentWithStaticMethods extends PDFDocument {
  create: () => PDFDocument;
  load: (string) => PDFDocument;
}
