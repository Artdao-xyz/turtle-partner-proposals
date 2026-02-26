import Header from "@/app/components/Header";

export default function ResourceHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
