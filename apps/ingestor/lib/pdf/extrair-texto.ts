import { extractText } from "unpdf";

export async function extrairTextoPdf(bytes: ArrayBuffer | Uint8Array): Promise<string> {
  const data =
    bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
  const result = await extractText(data);
  const text = Array.isArray(result.text) ? result.text.join("\n") : String(result.text ?? "");
  return text.replace(/\u0000/g, "").trim();
}
