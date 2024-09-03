"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Mail, Lock, User, Github } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmitSignup(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  async function onSubmitSignin(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }


  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <div className="m-auto w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Gavel className="h-10 w-10 text-purple-500" />
          <span className="ml-2 text-2xl font-bold text-purple-500">
            AuctionHub
          </span>
        </div>
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow-lg">
            <TabsTrigger
              value="signin"
              className="py-2 transition duration-300 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 rounded-lg"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="py-2 transition duration-300 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 rounded-lg"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitSignin)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                >
                  Submit
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitSignup)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                >
                  Submit
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
