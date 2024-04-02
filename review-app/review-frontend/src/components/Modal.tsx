import ReactDOM from "react-dom";

export const CustomModal = ({ isOpen, onClose, txid }: any) => {
  if (!isOpen) return null;
  let modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center border p-2 bg-white rounded-lg px-5">
        <p>Transaction submitted:</p>
        <a
          href={`https://explorer.solana.com/tx/${txid}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-violet-700"
        >
          View transaction on Solana Explorer 🎉
        </a>
        <button
          onClick={onClose}
          className="mt-5 mb-2 bg-violet-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Close
        </button>
      </div>
    </div>,
    modalRoot,
  );
};
