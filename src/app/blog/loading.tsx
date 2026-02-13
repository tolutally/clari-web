export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="w-32 h-16 bg-gray-200 rounded-lg mb-8 animate-pulse" />
          <div className="flex flex-wrap gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-32 h-10 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Featured Post Skeleton */}
        <div className="mb-12 overflow-hidden rounded-3xl">
          <div className="grid md:grid-cols-2 min-h-[400px]">
            <div className="bg-gray-800 p-12 flex flex-col justify-center animate-pulse">
              <div className="w-20 h-6 bg-gray-700 rounded-full mb-4" />
              <div className="w-full h-12 bg-gray-700 rounded-lg mb-4" />
              <div className="w-3/4 h-12 bg-gray-700 rounded-lg mb-8" />
              <div className="w-full h-6 bg-gray-700 rounded-lg mb-2" />
              <div className="w-5/6 h-6 bg-gray-700 rounded-lg mb-8" />
              <div className="w-40 h-12 bg-gray-700 rounded-full" />
            </div>
            <div className="bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <div className="flex justify-between mb-3">
                  <div className="w-20 h-6 bg-gray-200 rounded-full" />
                  <div className="w-24 h-6 bg-gray-200 rounded" />
                </div>
                <div className="w-full h-6 bg-gray-200 rounded mb-2" />
                <div className="w-4/5 h-6 bg-gray-200 rounded mb-4" />
                <div className="w-full h-4 bg-gray-200 rounded mb-2" />
                <div className="w-3/4 h-4 bg-gray-200 rounded mb-4" />
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
