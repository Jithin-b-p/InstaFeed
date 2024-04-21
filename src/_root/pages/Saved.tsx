import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";

const Saved = () => {
  const {
    data: userData,
    isPending: dataLoading,
    isError,
  } = useGetCurrentUser();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userData) {
      return;
    }

    setPosts(userData.save.map((savedPost, index) => savedPost.post));
  }, [userData]);

  return (
    <div className="px-10 py-14">
      <div className="flex flex-col gap-14">
        <div className="flex gap-2">
          <img
            src="/assets/icons/save.svg"
            alt="save"
            className="invert-white"
          />
          <h2 className="text-2xl font-bold">Saved Posts</h2>
        </div>
        <div>
          {dataLoading || !posts ? (
            <Loader />
          ) : (
            <GridPostList posts={posts} showUser={false} showStats={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;
