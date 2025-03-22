import Image from "next/image";

type Props = { children: React.ReactNode };

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="relative overflow-hidden">
      <div className="to-primary/20 absolute inset-0 -z-10 bg-gradient-to-b from-pink-50/15" />
      <Image
        src="/auth-bg.webp"
        alt="Cherry blossom school background"
        fill
        className="absolute inset-0 -z-20 object-cover opacity-90"
        priority
      />
      <main className="flex h-full min-h-svh items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
};
export default AuthLayout;
