import Markdown from "marked-react";

interface MarkdownRendererProps {
  markdown: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdown
}) => {
  const renderer = {};

  return <Markdown value={markdown} renderer={renderer} />;
};
