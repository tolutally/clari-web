export { metadata } from 'next-sanity/studio';

export default function AdminLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-lg">Loading Sanity Studio...</div>
    </div>
  );
}
