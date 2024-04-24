import ProfileForm from "@/components/forms/ProfileForm";

const UpdateProfile = () => {
  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 gap-10 px-5 py-10 overflow-scroll md:px-8 lg:p-14 custom-scrollbar">
        <div className="justify-start w-full max-w-5xl gap-3 flex-start">
          <img
            src="/assets/icons/edit.svg"
            className="invert-white"
            width={36}
            height={36}
            alt=""
          />
          <h2 className="w-full text-left h3-bold md:h2-bold">Edit Profile</h2>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
};

export default UpdateProfile;
