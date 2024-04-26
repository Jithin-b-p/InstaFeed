import Loader from "@/components/shared/Loader";
import {
  useGetCurrentUser,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GridPostList from "@/components/shared/GridPostList";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { id } = useParams();
  const { data: userDetails, isPending: detailsLoading } = useGetUserById(id);
  const { data: currentUserDetails, isPending: currentUserLoading } =
    useGetCurrentUser();

  if (detailsLoading || currentUserLoading)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="w-full px-4 py-5 overflow-y-scroll md:px-10 custom-scrollbar md:py-14">
      {/* profile details */}
      <div className="flex flex-col items-center md:flex-row md:items-start md:gap-[1.875rem] mb-4">
        <img
          src={userDetails?.imageUrl}
          alt=""
          height="150"
          width="150"
          className="object-cover object-center rounded-full md:self-start w-150 aspect-square"
        />
        <div className="flex flex-col gap-6 py-5">
          <div className="flex flex-col gap-5 md:gap-10 max-md:items-center md:flex-row">
            <div>
              <h1 className="text-3xl font-bold md:text-2xl lg:text-4xl">
                {userDetails?.name}
              </h1>
              <span className="block mt-2 font-medium max-md:text-center md:mt-4 text-light-4">
                @{userDetails?.username}
              </span>
            </div>

            {userDetails?.$id === currentUserDetails?.$id && (
              <Link to={`/update-profile/${id}`}>
                <Button>
                  <img
                    src="/assets/icons/edit.svg"
                    width={20}
                    height={20}
                    alt=""
                    className="mr-2 md:w-4 lg:w-5 aspect-square invert fill-yellow-600"
                  />
                  <span className="md:text-xs lg:text-base">Edit profile</span>
                </Button>
              </Link>
            )}
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

          {userDetails?.bio ? (
            <p>{userDetails.bio}</p>
          ) : (
            <p className="italic text-gray-700">
              "I am a mysterious individual"
            </p>
          )}
        </div>
      </div>

      {/* tab section */}

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="p-0 rounded-none bg-dark-3">
          <TabsTrigger
            className="h-full border-r-[1px] border-dark-4 data-[state=active]:bg-dark-4 md:px-14 rounded-none data-[state=active]:text-white text-white"
            value="posts"
          >
            <img src="/assets/icons/posts.svg" alt="posts" className="mr-2" />
            <span>Posts</span>
          </TabsTrigger>
          {currentUserDetails?.$id === userDetails?.$id && (
            <TabsTrigger
              className="h-full md:px-14 rounded-none data-[state=active]:bg-dark-4 data-[state=active]:text-white text-white"
              value="likes"
            >
              <img src="/assets/icons/liked.svg" alt="posts" className="mr-2" />
              <span>Liked</span>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="posts" className="pt-10">
          {userDetails &&
            (userDetails?.posts.length > 0 ? (
              <GridPostList posts={userDetails?.posts} showUser={false} />
            ) : (
              "No posts"
            ))}
        </TabsContent>
        {currentUserDetails?.$id === userDetails?.$id && (
          <TabsContent className="pt-10" value="likes">
            {userDetails?.liked.length ? (
              <GridPostList
                posts={userDetails?.liked}
                showUser={false}
                showStats={false}
              />
            ) : (
              "No liked posts yet"
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;
