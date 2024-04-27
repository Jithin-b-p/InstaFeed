import CreatorCard from "@/components/shared/CreatorCard";
import Loader from "@/components/shared/Loader";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

import { Key } from "react";

const AllUsers = () => {
  const { data: creators, isLoading: isUserLoading } = useGetUsers();

  return (
    <div className="flex-auto px-8 py-14">
      <div className="flex gap-4">
        <img
          className="invert-white"
          src="/assets/icons/people.svg"
          alt="peoples"
        />
        <h2 className="text-2xl font-bold">All Users</h2>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(15rem,_1fr))] px-8 py-10 place-contents-center gap-7">
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

export default AllUsers;
