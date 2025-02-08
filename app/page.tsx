import { OrganizationTree } from "@/components/organization-tree";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-2">
      <OrganizationTree />
    </main>
  );
} 