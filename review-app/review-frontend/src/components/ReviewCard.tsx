import { FC } from "react";
import { CardProps } from "@/types/type";
import { useWallet } from "@solana/wallet-adapter-react";

const ReviewCard: FC<CardProps> = ({ review, setIsEdit, setFormData }) => {
  const { title, description, rating, location } = review;
  const { publicKey } = useWallet();

  const handleEdit = () => {
    setIsEdit(true);
    setFormData({ title, description, rating, location });
  };
  return (
    <div className="relative group rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30 m-4">
      <h2 className={`mb-3 text-2xl font-semibold`}>{title.toUpperCase()} </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{description}</p>
      <p className={`mt-6 max-w-[30ch] text-sm opacity-75`}>{`${rating}/10`}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{location}</p>
      {publicKey && (
        <button
          className="absolute bottom-3 right-5 text-sm hover:text-purple-400 transition-all ease-out"
          onClick={handleEdit}
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
