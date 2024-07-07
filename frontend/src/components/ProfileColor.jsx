import React from "react";
import RegisterAndLogin from "./RegisterAndLogin";

function ProfileColor({ userId, name }) {
  const colors = [
    "bg-red-400",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-purple-200",
    "bg-pink-200",
  ];

  if (!userId || !name) {
    return <RegisterAndLogin />; // Return nothing if userId or name is not provided
  }

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  // console.log(color);
  return (
    <div className={`w-8 h-8 relative rounded-full flex items-center ${color}`}>
      <div className="text-center w-full text-black font-semibold uppercase">
        {name[0]}
      </div>
    </div>
  );
}

export default ProfileColor;
