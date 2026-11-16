export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="h-0.5 w-full bg-blue-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-500 animate-[pulse_1s_ease-in-out_infinite] w-full" />
      </div>
    </div>
  )
}
