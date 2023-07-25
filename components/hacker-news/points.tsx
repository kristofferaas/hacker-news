import { getItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowBigUpIcon } from "lucide-react";

export type PointsProps = {
  id: number;
};

export async function Points(props: PointsProps) {
  const item = await getItem(props.id);

  return (
    <div className="flex flex-col place-content-center text-center">
      <ArrowBigUpIcon className="mx-auto" />
      <span>{item.score}</span>
    </div>
  );
}
