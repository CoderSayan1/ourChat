import React from "react";

function ProfileColor({ userId, name, online }) {
  const colors = [
    "bg-red-400",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-purple-200",
    "bg-pink-200",
  ];
  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  // console.log(color);
  return (
    <div className={`w-8 h-8 relative rounded-full flex items-center ${color}`}>
      <div className="text-center w-full text-black font-semibold">
        {name[0]}
      </div>
      {online === true ? (
        <div className="absolute bg-green-600 w-3 h-3 right-0 bottom-0 rounded-full"></div>
      ) : (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
}

export default ProfileColor;
