import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Event } from "../../types/Event";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  finalizeBooking,
  resetBooking,
  clearSeats,
} from "../../redux/slices/bookingSlice";

// Define the expected structure for a successful booking result payload
type SuccessBookingPayload = {
  success: boolean;
  booking: {
    totalAmount: number;
    paymentSimulationId: string;
    // other booking details...
  };
  message: string;
};

// Type guard to safely check if bookingResult has the success/booking properties
// This solves the 'Property does not exist on type {}' errors.
function isBookingResultFinalized(
  result: unknown
): result is SuccessBookingPayload {
  // Check for the presence of the key that is guaranteed in the final state
  return (
    result !== null &&
    typeof result === "object" &&
    "success" in result &&
    "booking" in result
  );
}

interface BookingSummaryProps {
  event: Event;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ event }) => {
  const dispatch: AppDispatch = useDispatch();
  const {
    selectedSeatIds,
    isLoading,
    isSuccess,
    isError,
    message,
    bookingResult, // Now handled by the type guard
  } = useSelector((state: RootState) => state.booking);
  const user = useSelector((state: RootState) => state.auth.user);

  // State for replacing window.alert and window.confirm
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const totalSeats = selectedSeatIds.length;
  const totalPrice = event.price * totalSeats;

  // Reset success/error state when the component mounts or event changes
  useEffect(() => {
    dispatch(resetBooking());
    return () => {
      // Clear seats if user leaves the page
      dispatch(clearSeats());
    };
  }, [event._id, dispatch]);

  const handleInitialCheckout = () => {
    if (totalSeats === 0) {
      // FIX: Replaced alert()
      setUiMessage("Please select at least one seat.");
      return;
    }
    if (!user) {
      // FIX: Replaced alert()
      setUiMessage("You must be logged in to proceed.");
      return;
    }
    // FIX: Replaced window.confirm()
    setIsConfirming(true);
  };

  const handleFinalizeBooking = () => {
    setIsConfirming(false); // Close confirmation modal

    dispatch(
      finalizeBooking({
        eventId: event._id,
        selectedSeatIds,
      })
    );
  };

  // --- Display Booking Outcome ---
  // Using the type guard here to ensure bookingResult is correctly typed when accessed
  if (isBookingResultFinalized(bookingResult) && (isSuccess || isError)) {
    // TypeScript errors are resolved here
    const isPaymentSuccessful = Boolean(bookingResult.success);

    return (
      <div
        className="p-4 rounded-lg shadow-lg mt-6"
        style={{
          border: `2px solid ${isPaymentSuccessful ? "#10B981" : "#EF4444"}`,
        }}
      >
        <h4 className="text-xl font-semibold mb-2">Booking Status</h4>
        <p
          className="text-lg font-bold"
          style={{
            color: isPaymentSuccessful ? "#10B981" : "#EF4444",
          }}
        >
          {isPaymentSuccessful ? "✅ CONFIRMED!" : "❌ PAYMENT FAILED"}
        </p>
        <p className="mt-2">{message}</p>
        {isPaymentSuccessful && (
          <>
            {/* FIX: Safe access to nested properties */}
            <p className="mt-2">
              Total Paid:{" "}
              <strong className="text-gray-800">
                ${bookingResult.booking.totalAmount.toFixed(2)}
              </strong>
            </p>
            <p>Simulation ID: {bookingResult.booking.paymentSimulationId}</p>
            <p className="text-sm italic">
              Digital ticket sent to your email ({user?.email}).
            </p>
          </>
        )}
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
        >
          {isPaymentSuccessful ? "Start New Booking" : "Try Again"}
        </button>
      </div>
    );
  }

  // Custom Confirmation Modal/UI (replaces window.confirm)
  if (isConfirming) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
          <h4 className="text-2xl font-bold mb-4 text-gray-800">
            Confirm Reservation
          </h4>
          <p className="mb-6 text-gray-600">
            Confirm Booking:{" "}
            <strong className="font-extrabold text-lg">
              {totalSeats} seats
            </strong>{" "}
            for a total of{" "}
            <strong className="text-green-600 text-lg">
              ${totalPrice.toFixed(2)}
            </strong>
            ?
          </p>
          <div className="flex justify-between space-x-4">
            <button
              onClick={() => setIsConfirming(false)}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalizeBooking}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Running Payment Simulation...
          </p>
        </div>
      </div>
    );
  }

  // Custom Message/Alert UI (replaces window.alert)
  if (uiMessage) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
          <h4 className="text-xl font-bold mb-3 text-red-500">
            Action Required
          </h4>
          <p className="mb-6 text-gray-700">{uiMessage}</p>
          <button
            onClick={() => setUiMessage(null)}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // --- Display Summary Before Checkout ---
  return (
    <div className="p-6 bg-white shadow-xl rounded-xl border border-gray-100 booking-summary-box">
      <h4 className="text-2xl font-bold mb-4 text-gray-800">
        Your Reservation
      </h4>
      <div className="space-y-2 text-gray-600">
        <p>
          Seats Selected:{" "}
          <strong className="text-lg text-indigo-600">{totalSeats}</strong>
        </p>
        <p>
          Price per Seat:{" "}
          <strong className="text-gray-800">${event.price.toFixed(2)}</strong>
        </p>
      </div>

      <hr className="my-4 border-gray-200" />

      <p className="text-2xl font-extrabold mb-6 text-gray-900">
        Total: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
      </p>

      <button
        onClick={handleInitialCheckout}
        disabled={totalSeats === 0 || isLoading}
        className={`w-full py-3 text-lg font-semibold rounded-lg shadow-md transition duration-300
          ${
            totalSeats === 0 || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
      >
        {isLoading ? "Processing Payment..." : "Proceed to Checkout"}
      </button>

      {!user && (
        <p className="mt-4 text-center text-sm text-red-500">
          *You must be logged in to checkout.
        </p>
      )}
    </div>
  );
};

export default BookingSummary;
