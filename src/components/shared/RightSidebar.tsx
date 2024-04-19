import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import CreatorCard from "./CreatorCard";

const RightSidebar = () => {
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers();

  console.log(creators);
  return (
    <div className="rightsidebar">
      <h3 className="text-xl font-bold">Top Creators</h3>
      <ul className="flex flex-wrap">
        {isUserLoading ? (
          <Loader />
        ) : (
          creators?.documents.map((creator: any) => (
            <CreatorCard
              key={creator.$id}
              name={creator.name}
              imageUrl={creator.imgUrl}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default RightSidebar;
