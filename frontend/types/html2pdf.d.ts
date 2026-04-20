declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    html2canvas?: Record<string, unknown>;
    jsPDF?: Record<string, unknown>;
    pagebreak?: Record<string, unknown>;
  }

  interface Html2PdfInstance {
    from(element: Element): this;
    set(options: Html2PdfOptions): this;
    save(): Promise<void>;
    output(type: string): Promise<Blob>;
  }

  function html2pdf(): Html2PdfInstance;
  export = html2pdf;
}
