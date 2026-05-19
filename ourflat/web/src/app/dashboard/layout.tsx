import { DemoAuthProvider } from '@/hooks/useDemoAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DemoAuthProvider>{children}</DemoAuthProvider>;
}
