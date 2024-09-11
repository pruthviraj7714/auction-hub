"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, DollarSign, Clock, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  startingPrice: z
    .number()
    .min(1, { message: "Starting price must be at least 1" }),
  category: z.string().min(1, { message: "Please select a category" }),
  startingTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time",
  }),
  endingTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time",
  }),
  productTitle: z
    .string()
    .min(3, { message: "Product title must be at least 3 characters long" }),
  productDescription: z.string().min(10, {
    message: "Product description must be at least 10 characters long",
  }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
});

export default function CreateAuctionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startingPrice: 0,
      category: "",
      startingTime: "",
      endingTime: "",
      productTitle: "",
      productDescription: "",
      imageUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const startingTimeElement = document.getElementById(
        "startingTime"
      ) as HTMLInputElement | null;
      const endingTimeElement = document.getElementById(
        "endingTime"
      ) as HTMLInputElement | null;

      if (!startingTimeElement || !endingTimeElement) {
        throw new Error("Date inputs not found");
      }

      const startingTimeInput = startingTimeElement.value;
      const endingTimeInput = endingTimeElement.value;

      const startingTimeISO = new Date(startingTimeInput).toISOString();
      const endingTimeISO = new Date(endingTimeInput).toISOString();

      const res = await axios.post("/api/auction/create", {
        ...values,
        startingTime: startingTimeISO,
        endingTime: endingTimeISO,
      });

      toast.success(res.data.message);
      form.reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Auction</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="bg-purple-300">
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>
                    Provide details about the product you&apos;re auctioning.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="productTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product title"
                            {...field}
                            className="bg-white text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the product"
                            {...field}
                            className="bg-white text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Image URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <ImageIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              className="pl-10 bg-white text-black"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Provide a URL to an image of the product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="bg-purple-300">
                <CardHeader>
                  <CardTitle>Auction Details</CardTitle>
                  <CardDescription>
                    Provide the details for your auction.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auction Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter auction title"
                            {...field}
                            className="bg-white text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auction Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your auction"
                            {...field}
                            className="bg-white text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              className="pl-10 bg-white text-black"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white text-black">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="electronics">
                              Electronics
                            </SelectItem>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="art">Art</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Starting Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input
                                type="datetime-local"
                                id="startingTime"
                                {...field}
                                className="pl-10 bg-white text-black"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ending Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                              <Input
                                type="datetime-local"
                                id="endingTime"
                                {...field}
                                className="pl-10 bg-white text-black"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Auction..." : "Create Auction"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
