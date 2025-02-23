export default function AuthPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">{children}</div>
    </div>
  );
}
