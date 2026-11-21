import { UserIcon } from "lucide-react";

const ContactCard = ({ conversation, currentUserId, onSelect }) => {
  const participant = conversation.participants[0];
  return (
    <>
      <div
        className=" rounded-lg flex items-center justify-center gap-5 cursor-pointer p-3"
        onClick={onSelect}
      >
        {/* <img
                  src={BackImage}
                  alt="just an image"
                  width={40}
                  className="border border-white rounded-4xl"
                /> */}
        <UserIcon />
        <div className="flex flex-col ">
          <p className="text-lg">{participant?.username}</p>
          <p className="font-light text-sm truncate w-50">
            {conversation.last_message || "No messages yet"}
          </p>
        </div>
        <p>12:15</p>
      </div>
    </>
  );
};

export default ContactCard;
