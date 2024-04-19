import { Button } from "../ui/button";

type creatorCardProps = {
  name: string;
  imageUrl: string;
};

const CreatorCard = ({ name, imageUrl }: creatorCardProps) => {
  return (
    <li>
      <img
        src={imageUrl || "/assets/icons/profileholder.svg"}
        alt="profile picture"
        className="rounded-full h-14 w-14"
      />

      <h3>{name}</h3>
      <Button className="shad-button_primary">Follow</Button>
    </li>
  );
};

export default CreatorCard;
