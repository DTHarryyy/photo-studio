export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-full w-full overflow-hidden">{children}</div>;
}
