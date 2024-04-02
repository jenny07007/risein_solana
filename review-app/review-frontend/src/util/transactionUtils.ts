import * as web3 from "@solana/web3.js";
import { Review } from "@/models/Review";

export const submitReviewTransaction = async (
  review: Review,
  publicKey: web3.PublicKey,
  sendTransaction: (
    transaction: web3.Transaction,
    connection: web3.Connection,
  ) => Promise<string>,
  connection: web3.Connection,
  REVIEW_PROGRAM_ID: string,
): Promise<string> => {
  const buffer = review.serialize();
  const transaction = new web3.Transaction();

  const [pda] = await web3.PublicKey.findProgramAddress(
    [publicKey.toBuffer(), Buffer.from(review.title)],
    new web3.PublicKey(REVIEW_PROGRAM_ID),
  );

  const instruction = new web3.TransactionInstruction({
    data: buffer,
    keys: [
      { pubkey: publicKey, isSigner: true, isWritable: true },
      { pubkey: pda, isSigner: false, isWritable: true },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    programId: new web3.PublicKey(REVIEW_PROGRAM_ID),
  });

  transaction.add(instruction);

  const txid = await sendTransaction(transaction, connection);
  return txid;
};
