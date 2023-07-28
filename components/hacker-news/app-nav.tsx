"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const AppNav = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get("query");
  const time = searchParams.get("time");

  return (
    <>
      <nav className="fixed w-screen h-14 py-2 bg-background border-b">
        <div className="container max-w-5xl flex flex-grow items-center">
          <Button
            className="mr-2 text-white bg-orange-500 text-lg hover:bg-orange-600 shrink-0"
            size="icon"
            asChild
          >
            <Link href="/">Y</Link>
          </Button>
          <Search query={query} time={time} />
        </div>
      </nav>
    </>
  );
};

type SearchProps = {
  query: string | null;
  time: string | null;
};

const Search = ({ query, time }: SearchProps) => {
  return (
    <form className="flex flex-grow space-x-2">
      <Input placeholder="Search" name="query" defaultValue={query || ""} />
      {/* for "did not match" warning see https://github.com/vercel/next.js/issues/53110 */}
      <Select name="time" defaultValue={time || "today"}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Search</Button>
    </form>
  );
};