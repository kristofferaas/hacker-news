import { ThemeSelect } from "../ui/theme";

export const AppFooter = () => {
  return (
    <div className="border-t flex flex-col mt-8">
      <div className="container max-w-5xl py-8 space-y-8 flex flex-col md:flex-row md:space-y-0 md:justify-between">
        <HackerNewsColumn />
        <OrganizationColumn />
        <AppearanceColumn />
      </div>
      <span className="self-center py-8 text-muted-foreground text-sm">
        © 2023 Acme Inc. All rights reserved.
      </span>
    </div>
  );
};

const HackerNewsColumn = () => {
  return (
    <div className="flex flex-col space-y-2">
      <span className="font-medium text-sm">About Hacker News</span>
      <span className="text-muted-foreground text-sm">Guidelines</span>
      <span className="text-muted-foreground text-sm">FAQ</span>
      <span className="text-muted-foreground text-sm">Lists</span>
      <span className="text-muted-foreground text-sm">Security</span>
      <span className="text-muted-foreground text-sm">API</span>
      <span className="text-muted-foreground text-sm">Search API</span>
      <span className="text-muted-foreground text-sm">Legal</span>
      <span className="text-muted-foreground text-sm">Apply to YC</span>
      <span className="text-muted-foreground text-sm">Contact</span>
    </div>
  );
};

const OrganizationColumn = () => {
  return (
    <div className="flex flex-col space-y-2">
      <span className="font-medium text-sm">About aas.dev</span>
      <span className="text-muted-foreground text-sm">Website</span>
      <span className="text-muted-foreground text-sm">GitHub</span>
      <span className="text-muted-foreground text-sm">LinkedIn</span>
      <span className="text-muted-foreground text-sm">Twitter</span>
      <span className="text-muted-foreground text-sm">Email</span>
    </div>
  );
};

const AppearanceColumn = () => {
  return (
    <div className="flex flex-col space-y-2">
      <ThemeSelect />
    </div>
  );
};
