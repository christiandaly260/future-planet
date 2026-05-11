import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Future Planet
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sales intelligence platform
          </p>
        </div>
        <SignIn />
      </div>
    </main>
  );
}
