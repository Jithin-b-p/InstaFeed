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
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { toast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

const ProfileForm = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: updateProfile, isPending: isUpdateLoading } =
    useUpdateUser();

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
  async function onSubmit(values: z.infer<typeof ProfileValidationSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const updatedProfile = await updateProfile({
      userId: user.id,
      name: values.name,
      bio: values.bio,
      imageId: "",
      imageUrl: user.imageUrl,
      file: values.file,
    });

    if (!updatedProfile) return toast({ title: "please try again!!" });

    console.log(updatedProfile);
    setUser({
      ...user,
      imageUrl: updatedProfile.imageUrl,
      bio: updatedProfile.bio,
      name: updatedProfile.name,
    });

    return navigate(`/profile/${user.id}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-xl gap-9"
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
                  disabled
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
          {isUpdateLoading ? <Loader /> : "Update profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
