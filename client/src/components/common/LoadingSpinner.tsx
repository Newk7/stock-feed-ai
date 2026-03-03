export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-surface-800" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-wire-500 border-t-transparent animate-spin" />
        </div>
        <span className="text-sm text-surface-400">Loading SmartWire...</span>
      </div>
    </div>
  );
}
