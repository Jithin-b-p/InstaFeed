import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import CreatorCard from "./CreatorCard";

const RightSidebar = () => {
  const { data: creators, isLoading: isUserLoading } = useGetUsers(2);

  return (
    <div className="overflow-y-scroll rightsidebar border-l-[1px] border-dark-4">
      <h3 className="text-2xl font-bold">Top Creators</h3>
      <ul className="grid place-content-center min-[1375px]:grid-cols-2 gap-7">
        {isUserLoading ? (
          <Loader />
        ) : (
          creators?.documents.map((creator) => (
            <CreatorCard
              key={creator.$id}
              name={creator.name}
              imageUrl={creator.imageUrl}
              username={creator.username}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default RightSidebar;
