import { Button } from "../ui/button";

type creatorCardProps = {
  name: string;
  imageUrl: string;
};

const CreatorCard = ({ name, imageUrl }: creatorCardProps) => {
  return (
    <li className="px-10 py-8 border-[1px] rounded-3xl border-dark-4 flex flex-col items-center gap-5">
      <img
        src={imageUrl || "/assets/icons/profileholder.svg"}
        alt="profile picture"
        className="rounded-full h-14 w-14"
      />

      <h3 className="text-base font-medium">{name}</h3>
      <Button className="shad-button_primary">Follow</Button>
    </li>
  );
};

export default CreatorCard;
