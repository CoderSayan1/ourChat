import React from "react";
import ProfileColor from "./ProfileColor";

function AllUsers({id, name, onClick, selected}) {
  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={
        "py-3 px-2 border border-gray-50 border-r-0 border-b-0 rounded-tl-xl rounded-bl-xl flex items-center gap-3 cursor-pointer " +
        (selected ? "bg-green-500" : "")
      }
    >
      {(id && name) ? ( <ProfileColor name={name} userId={id}/>) : <RegisterAndLogin /> }
      <span className="capitalize">{name}</span>
    </div>
  );
}

export default AllUsers;
