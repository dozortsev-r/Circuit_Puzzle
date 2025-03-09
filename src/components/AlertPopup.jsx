export default function AlertPopup({ setIsAlertPopupOpen, closeButton, message }) {
  return (
    <div className="flex-wrap fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-md text-center">
        <p className="mb-4">
          {message}
        </p>
        <button
          className="bg-green-800 text-white px-4 py-2 rounded-md font-medium"
          onClick={() => setIsAlertPopupOpen(false)}
        >
          {closeButton}
        </button>
      </div>
    </div>
  ); 
}