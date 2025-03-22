import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "../../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-4 w-full max-w-md border-2 border-pink-200/50 bg-white/50 shadow-lg backdrop-blur-sm duration-500">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Login</CardTitle>
        <CardDescription className="font-sans">
          Welcome back! Please enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
