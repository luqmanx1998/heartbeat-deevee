export default function Page() {
  return (
    <div className="min-h-screen bg-pure-black-100 text-pure-white-100 px-6 flex items-center">
      <div className="max-w-lg mx-auto space-y-3">
        <h1 className="title-normal">Login failed</h1>
        <p className="p-small text-pure-white-50">
          Something went wrong during the sign-in callback. Please try again.
        </p>
        <a href="/login" className="inline-block royal-gold-bg text-pure-black-100 px-4 py-2 rounded-xl">
          Back to login
        </a>
      </div>
    </div>
  );
}