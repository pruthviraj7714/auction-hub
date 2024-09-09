"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema, signInSchema } from "@/schemas/schema";
import axios from "axios";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("signup");
  const router = useRouter();

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmitSignup(data: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", data);
      toast.success(res.data.message, {
        description: "Now Sign in with your credentials",
      });
      setActiveTab("signin");
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmitSignin(data: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.ok) {
        router.push("/home");
      } else {
        toast.error(res?.error ?? "Error while sign in!");
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message ?? error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (session && session?.user) {
      router.push("/home");
    }
  }, [session, router]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <div className="m-auto w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Gavel className="h-10 w-10 text-purple-500" />
          <span className="ml-2 text-2xl font-bold text-purple-500">
            AuctionHub
          </span>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="signin" className="">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(onSubmitSignin)}
                className="space-y-8"
              >
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="enter your password here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="bg-purple-600 hover:bg-purple-500 px-4 py-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Submit"}
                </Button>
              </form>
            </Form>
            <p className="mt-4 text-center text-sm text-gray-500">
              <Link
                className="hover:text-purple-400 underline underline-offset-4 transition duration-300"
                href="#"
              >
                Forgot your password?
              </Link>
            </p>
          </TabsContent>
          <TabsContent value="signup">
            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(onSubmitSignup)}
                className="space-y-8"
              >
                <FormField
                  control={signUpForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="jon432" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="enter your password here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="bg-purple-600 hover:bg-purple-500 px-4 py-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Submit"}
                </Button>
              </form>
            </Form>
            <p className="mt-4 text-center text-sm text-gray-500">
              By signing up, you agree to our{" "}
              <Link
                className="hover:text-purple-400 underline underline-offset-4 transition duration-300"
                href="#"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                className="hover:text-purple-400 underline underline-offset-4 transition duration-300"
                href="#"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
