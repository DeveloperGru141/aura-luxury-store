export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-32 rounded bg-gray-200 animate-pulse" />
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-4/6 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="p-6 space-y-3">
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
          <div className="h-10 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
