"use client";

const Counter = ({
  children1,
  children2,
}: {
  children1: React.ReactNode;
  children2: React.ReactNode;
}) => {
  return (
    <>
      {children1}
      {children2}
    </>
  );
};

export default Counter;
