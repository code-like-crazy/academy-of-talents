import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-4 bg-card/90 w-full max-w-md border-pink-200/50 shadow-lg backdrop-blur-sm duration-1000">
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
