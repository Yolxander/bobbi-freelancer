export default function OnboardingLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading onboarding...</p>
      </div>
    </div>
  )
}
