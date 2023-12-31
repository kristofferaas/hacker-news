type LayoutProps = {
  children?: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <div className="h-screen flex flex-col">{children}</div>;
};

export const Header = ({ children }: LayoutProps) => {
  return <header className="h-14 flex-shrink-0">{children}</header>;
};

export const Body = ({ children }: LayoutProps) => {
  return <main className="flex-grow">{children}</main>;
};

export const Footer = ({ children }: LayoutProps) => {
  return <footer className="flex-shrink-0">{children}</footer>;
};
