import PDFParser from "pdf2json";

export const extractTextFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      console.error("PDF parsing error:", err);
      reject(err.parserError || err);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const pages = pdfData?.Pages || pdfData?.formImage?.Pages;
      
          if (!pages || !Array.isArray(pages)) {
            return reject(new Error("No pages found in parsed PDF data."));
          }
      
          const rawText = pages.map((page) =>
            page.Texts.map((text) =>
              decodeURIComponent(text.R?.[0]?.T || "")
            ).join(" ")
          ).join("\n\n");
      
          resolve(rawText);
        } catch (err) {
          reject(err);
        }
      });
      
    // Make sure buffer is valid
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return reject(new Error("Invalid PDF buffer provided."));
    }

    pdfParser.parseBuffer(buffer);
  });
};
