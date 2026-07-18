/**
 * Triggers a browser download of a PDF blob.
 * @param {Blob} blob     - the PDF blob returned by axios
 * @param {string} filename - e.g. "ticket_seat5.pdf"
 */
export function savePdfBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
