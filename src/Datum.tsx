import React, { useEffect, useState } from "react";

const Datum: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentDate(new Date());
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>{currentDate.toDateString()}</h1>
    </div>
  );
};

export default Datum;
