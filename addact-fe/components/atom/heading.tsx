import { JSX } from "react";
type Props = {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function Heading({ text, level = 1 }: Props) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag>{text}</Tag>;
}
