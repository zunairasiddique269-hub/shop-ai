import { AuthForm } from "@/components/account/AuthForm";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";

export const metadata = {
  title: "Sign in",
  description: "Account access will be connected in a later ShopAI phase.",
};

export default function LoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Sign in"
        description="This is a polished layout for a forthcoming authentication system."
      />
      <div className="px-4 py-12 sm:px-6 sm:py-16">
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-sm text-muted">
          New to ShopAI?{" "}
          <Link href="/register" className="text-plum underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}
