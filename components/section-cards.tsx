import type { Data } from "@puckeditor/core";
import { CardSmall } from "./dpp-sida-card";

interface SectionCardsProps {
  pages: { path: string; data: Data }[];
  onRefresh: () => void;
}

export function SectionCards({ pages, onRefresh }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {pages.map((page) => (
        <CardSmall
          key={page.path}
          path={page.path}
          data={page.data}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
