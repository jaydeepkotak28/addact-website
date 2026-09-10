import React from "react";
import parse from "html-react-parser";

export interface RichTextProps {
  html?: string | null;
  className?: string;
}

export const RichText: React.FC<RichTextProps> = ({
  html,
  className = "",
}) => {
  if (!html) return null;

  // Strip pasted inline "white-space: pre" from Slate/CKEditor which prevents text wrapping
  const cleanedHtml = html.replace(/white-space:\s*pre;?/gi, "white-space: normal;");

  return (
    <div
      className={`rich-text text-black text-base leading-relaxed space-y-4 break-words [&_*]:!whitespace-normal [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:leading-normal [&_p]:leading-relaxed ${className}`}
    >
      {parse(cleanedHtml)}
    </div>
  );
};

export default RichText;
