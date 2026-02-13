export const metadata = {
  title: 'Clarivue CMS Admin',
  description: 'Content management system for Clarivue',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
