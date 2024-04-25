import { Button } from "../ui/button";

type creatorCardProps = {
  name: string;
  imageUrl: string;
  username: string;
};

const CreatorCard = ({ name, imageUrl, username }: creatorCardProps) => {
  return (
    <li className="px-10 py-8 border-[1px] rounded-3xl border-dark-4 flex flex-col items-center gap-5">
      <img
        src={imageUrl || "/assets/icons/profileholder.svg"}
        alt="profile picture"
        width={56}
        height={56}
        className="object-cover object-center rounded-full h-14 w-14"
      />

      <h3 className="text-base font-medium">{name}</h3>
      <span className="-mt-4 text-sm text-gray-500">@{username}</span>
      <Button className="shad-button_primary">Follow</Button>
    </li>
  );
};

export default CreatorCard;
