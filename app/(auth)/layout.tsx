export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-6">
      {children}
    </main>
  );
}
