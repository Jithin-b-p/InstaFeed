import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type ProfileImageUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};
const ProfileImageUploader = ({
  fieldChange,
  mediaUrl,
}: ProfileImageUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });
  return (
    <div {...getRootProps()} className="w-fit">
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex items-center gap-5">
            <img
              width={80}
              height={80}
              className="object-cover object-center w-20 h-20 rounded-full"
              src={fileUrl}
              alt=""
            />
            <p className="font-semibold text-blue-500 cursor-pointer">
              Change profile photo
            </p>
          </div>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/profile-placeholder.svg"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full"
            alt=""
          />
          <p className="font-semibold text-blue-500 cursor-pointer">
            Change profile photo
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
