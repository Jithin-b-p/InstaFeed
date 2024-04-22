import Loader from "@/components/shared/Loader";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GridPostList from "@/components/shared/GridPostList";

const Profile = () => {
  const { id } = useParams();
  const { data: userDetails, isPending: detailsLoading } = useGetUserById(id);

  if (detailsLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="w-full px-10 overflow-y-scroll py-14">
      {/* profile details */}
      <div className="flex gap-[1.875rem] mb-4">
        <img
          src={userDetails?.imageUrl}
          alt="profile picture"
          height="150"
          width="150"
          className="self-start rounded-full"
        />
        <div className="flex flex-col gap-6 py-5">
          <div>
            <div>
              <h1 className="text-4xl font-bold">{userDetails?.name}</h1>
            </div>

            <span className="font-medium text-light-4">
              @{userDetails?.username}
            </span>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col self-start">
              <span className="text-center text-primary-500">
                {userDetails?.posts.length}
              </span>
              <span>Posts</span>
            </div>
            <div className="flex flex-col self-start">
              <span className="text-center text-primary-500">0</span>
              <span>Followers</span>
            </div>
            <div className="flex flex-col self-start">
              <span className="text-center text-primary-500">0</span>
              <span>Following</span>
            </div>
          </div>

          <p>{userDetails?.bio ? userDetails.bio : '"Nill"'}</p>
        </div>
      </div>

      {/* tab section */}

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="p-0 bg-dark-3">
          <TabsTrigger
            className="h-full border-r-[1px] border-dark-4 data-[state=active]:bg-dark-4 px-14 rounded-none data-[state=active]:text-white text-white"
            value="posts"
          >
            <img src="/assets/icons/posts.svg" alt="posts" className="mr-2" />
            <span>Posts</span>
          </TabsTrigger>
          <TabsTrigger
            className="h-full px-14 rounded-none data-[state=active]:bg-dark-4 data-[state=active]:text-white text-white"
            value="likes"
          >
            <img src="/assets/icons/liked.svg" alt="posts" className="mr-2" />
            <span>Liked</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="pt-10">
          {userDetails &&
            (userDetails?.posts.length > 0 ? (
              <GridPostList posts={userDetails?.posts} showUser={false} />
            ) : (
              "No posts"
            ))}
        </TabsContent>
        <TabsContent value="likes">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
