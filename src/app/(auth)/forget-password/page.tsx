import Link from "next/link";

export default function ForgetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full border rounded-xl p-6">
        <h1 className="text-xl font-semibold">Forget Password</h1>
        <p className="mt-2 text-gray-600">
          এখানে email দিয়ে reset link পাঠানোর UI বানাবো।
        </p>
        <Link className="inline-block mt-4 text-blue-600 underline" href="/signin">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
