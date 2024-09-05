import Appbar from "@/components/appbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Appbar />
      {children}
    </div>
  );
}
