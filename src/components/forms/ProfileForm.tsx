import { useUserContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ProfileValidationSchema } from "@/lib/validation";
import ProfileImageUploader from "../shared/ProfileImageUploader";

const ProfileForm = () => {
  const { user } = useUserContext();
  ("use client");

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileValidationSchema>>({
    resolver: zodResolver(ProfileValidationSchema),
    defaultValues: {
      file: [],
      name: user ? user.name : "",
      username: user ? user.username : "",
      email: user ? user.email : "",
      bio: user ? user.bio : "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof ProfileValidationSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-5xl gap-9"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="sr-only">Add profile</FormLabel>
              <FormControl>
                <ProfileImageUploader
                  fieldChange={field.onChange}
                  mediaUrl={user?.imageUrl}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  placeholder="username"
                  {...field}
                />
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
                <Input
                  disabled
                  className="shad-input"
                  type="email"
                  placeholder="enter email"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="self-end w-48 bg-primary-600" type="submit">
          Update profile
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
