"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

type SearchProps = {
  query: string;
};

const searchFormSchema = z.object({
  query: z.string(),
});

type SearchForm = z.infer<typeof searchFormSchema>;

export const Search = ({ query }: SearchProps) => {
  const router = useRouter();

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query,
    },
  });

  const onSubmit = (values: SearchForm) => {
    console.log("values", values);

    const searchParams = new URLSearchParams();
    searchParams.set("query", values.query);

    console.log(searchParams.toString());
    router.push(`/posts?${searchParams.toString()}`);
  };

  return (
    <Form {...form}>
      <form className="flex space-x-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormControl>
              <Input placeholder="Search" {...field} />
            </FormControl>
          )}
        />
        <Button type="submit">Search</Button>
      </form>
    </Form>
  );
};
