import { AuthForm } from "@/components/account/AuthForm";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";

export const metadata = {
  title: "Create account",
  description: "Registration will be connected in a later ShopAI phase.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Create account"
        description="A placeholder form so the register route is ready for later identity work."
      />
      <div className="px-4 py-12 sm:px-6 sm:py-16">
        <AuthForm mode="register" />
        <p className="mt-6 text-center text-sm text-muted">
          Already with us?{" "}
          <Link href="/login" className="text-plum underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
