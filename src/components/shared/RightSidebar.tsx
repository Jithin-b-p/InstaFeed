import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import CreatorCard from "./CreatorCard";
import { Key } from "react";

const RightSidebar = () => {
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(2);

  return (
    <div className="overflow-y-scroll rightsidebar">
      <h3 className="text-2xl font-bold">Top Creators</h3>
      <ul className="grid place-content-center min-[1375px]:grid-cols-2 gap-7">
        {isUserLoading ? (
          <Loader />
        ) : (
          creators?.documents.map(
            (creator: {
              $id: Key | null | undefined;
              name: string;
              imageUrl: string;
              username: string;
            }) => (
              <CreatorCard
                key={creator.$id}
                name={creator.name}
                imageUrl={creator.imageUrl}
                username={creator.username}
              />
            )
          )
        )}
      </ul>
    </div>
  );
};

export default RightSidebar;
