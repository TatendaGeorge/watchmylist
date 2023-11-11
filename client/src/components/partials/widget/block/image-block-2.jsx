import React from "react";
import Image2 from "@/assets/images/all-img/widget-bg-2.png";
function ImageBlock2({ name }) {
  // Get the current hour
  const currentHour = new Date().getHours();

  // Define greeting messages based on the time of day
  let greeting = "";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning,";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon,";
  } else {
    greeting = "Good Evening,";
  }

  return (
    <div
      className="bg-no-repeat bg-cover bg-center p-5 rounded-[6px] relative"
      style={{
        backgroundImage: `url(${Image2})`,
      }}
    >
      <div>
        <h4 className="text-xl font-medium text-white mb-2">
          <span className="block font-normal">{greeting}</span>
          <span className="block">{name}</span>
        </h4>
        <p className="text-sm text-white font-normal">Welcome to Dashcode</p>
      </div>
    </div>
  );
};

export default ImageBlock2;
