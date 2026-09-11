import parse from "html-react-parser";

export default function RichText({ html }: { html: string }) {
  return <>{parse(html)}</>;
}
