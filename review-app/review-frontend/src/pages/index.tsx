import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/Form";
import { AppBar } from "@/components/AppBar";
import { Review } from "@/models/Review";
import { fetchReviews } from "@/util/fetchReviews";
import { CustomModal } from "@/components/Modal";
import { submitReviewTransaction } from "@/util/transactionUtils";
import { handleError } from "@/util/errorUtils";

const REVIEW_PROGRAM_ID = "G1NjaFUtqPzdTho4VeXdowmRGzKDhS4ckgzzs9JQ1nVg";

const Home = () => {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const { publicKey, sendTransaction } = useWallet();

  const [txid, setTxid] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    rating: 0,
    description: "",
    location: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAccounts = async () => {
    try {
      const reviews = await fetchReviews(REVIEW_PROGRAM_ID, connection);
      setReviews(reviews);
    } catch (error) {
      handleError(error as Error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateOrUpdateSubmit = async () => {
    const variant = isEdit ? 1 : 0;
    const review = new Review(
      formData.title,
      formData.rating,
      formData.description,
      formData.location,
      variant,
    );

    await handleTransactionSubmit(review);

    if (isEdit) {
      setIsEdit(false);
      resetFormData();
    }
  };

  const handleTransactionSubmit = async (review: Review) => {
    if (!publicKey) {
      handleError(new Error("Please connect your wallet."));
      return;
    }

    try {
      const txid = await submitReviewTransaction(
        review,
        publicKey,
        sendTransaction,
        connection,
        REVIEW_PROGRAM_ID,
      );
      setTxid(txid);
      setIsModalOpen(true);
    } catch (error) {
      handleError(error as Error);
    }

    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      title: "",
      rating: 0,
      description: "",
      location: "",
    });
  };

  const handleCancle = () => {
    setIsEdit(false);
    resetFormData();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <AppBar />
      </div>

      <div className="after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <ReviewForm
          formData={formData}
          handleFormChange={handleFormChange}
          handleCreateOrUpdateSubmit={handleCreateOrUpdateSubmit}
          isEdit={isEdit}
          handleCancle={handleCancle}
        />
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchAccounts();
        }}
        txid={txid}
      />
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        {reviews.map((review) => (
          <ReviewCard
            key={review.title}
            review={review}
            setIsEdit={setIsEdit}
            setFormData={setFormData}
          />
        ))}
      </div>
    </main>
  );
};

export default Home;
