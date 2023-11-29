"use client";

import { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

type PDFViewerProps = {
  pdf_url: string;
};

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export const PDFViewer = ({
  pdf_url,
}: PDFViewerProps) => {
  const [numPages, setNumPages] =
    useState<number>();

  function onDocumentLoadSuccess({
    numPages,
  }: {
    numPages: number;
  }): void {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={pdf_url}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        {Array.from(
          new Array(numPages),
          (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
            />
          )
        )}
      </Document>
    </div>
  );
};
