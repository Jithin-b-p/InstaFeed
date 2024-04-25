import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SigninValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

const SigninForm = () => {
  const { checkAuthUser } = useUserContext();

  const { mutateAsync: signInAccount, isPending: isUserLoading } =
    useSignInAccount();

  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidationSchema>>({
    resolver: zodResolver(SigninValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidationSchema>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "Invalid Credentials, Please try again.",
      });
    }
    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Sign in failed, Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-[26.25rem] flex-center flex-col">
        {/* <img src="/assets/images/logo.svg" alt="" /> */}
        <h1 className="text-4xl font-bold text-primary-600">InstaFeed</h1>
        <h2 className="pt-5 h3-bold md: h2-bold sm:pt-12">
          Login to your account
        </h2>
        <p className="mt-2 text-light-3 small-medium md:base-regular">
          Welcome back! Please enter your credentials
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5 mt-4"
        >
          {/* form field-email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* form field-password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="shad-button_primary"
            disabled={isUserLoading}
          >
            {isUserLoading ? <Loader /> : "Sign in"}
          </Button>

          <p className="mt-2 text-center text-small-regular text-light-2">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="ml-1 text-primary-500 text-small-semibold"
            >
              signup
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
