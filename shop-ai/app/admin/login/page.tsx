import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/dal";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Logo } from "@/components/brand/Logo";

export const metadata = {
  title: "Admin sign in",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-plum-deep px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo inverted />
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold">
            Admin Dashboard
          </p>
        </div>
        <AdminLoginForm />
        <p className="mt-6 text-center text-xs text-mauve-deep">
          This area is for authorized ShopAI staff only.
        </p>
      </div>
    </div>
  );
}
