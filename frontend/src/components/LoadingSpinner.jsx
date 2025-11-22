import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-1 bg-white rounded-full"></div>
      </div>
      <p className="text-gray-600 text-lg font-semibold">Loading...</p>
    </div>
  );
}
