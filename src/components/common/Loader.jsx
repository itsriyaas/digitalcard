import React from "react";

const Loader = ({ size = 48, message = "Loading..." }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-8">
      <div
        className="rounded-full border-4 border-t-4 border-blue-600 border-opacity-20 animate-spin"
        style={{ width: size, height: size, borderTopColor: "#1d4ed8" }}
        aria-hidden
      />
      {message && (
        <p className="mt-3 text-sm text-gray-500" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
