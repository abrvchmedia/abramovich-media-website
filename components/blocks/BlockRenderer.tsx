import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import HeroBlock from "./HeroBlock";
import CTABlock from "./CTABlock";
import GridBlock from "./GridBlock";

interface Block {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const BLOCK_MAP: Record<string, React.ComponentType<any>> = {
  text: TextBlock,
  image: ImageBlock,
  hero: HeroBlock,
  cta: CTABlock,
  grid: GridBlock,
};

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <>
      {sorted.map((block) => {
        const Component = BLOCK_MAP[block.type];
        if (!Component) return null;
        return <Component key={block.id} {...(block.content as any)} />;
      })}
    </>
  );
}
