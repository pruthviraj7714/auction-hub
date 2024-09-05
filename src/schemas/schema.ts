import z from "zod";
export const signUpSchema = z.object({
  username: z.string().min(3, "Username should be at least of 3 characters"),
  email: z.string().email("Email should be valid"),
  password: z.string().min(6, "Password Should be at least of 6 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Email should be valid"),
  password: z.string().min(6, "Password Should be at least of 6 characters"),
});

export const auctionSchema = z.object({
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
