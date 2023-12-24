export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{process.env.APP_HOST && process.env.APP_HOST.length > 0 && children}</>
  );
}
