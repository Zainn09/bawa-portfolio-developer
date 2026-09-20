import Navigation from "@/components/Navigation";
import JournalFooter from "@/components/blog/JournalFooter";
export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation homeBase="/" />
      {children}
      <JournalFooter />
    </>
  );
}
