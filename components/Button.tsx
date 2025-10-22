import React from "react";

type buttonProps = {
  name: string;
  px: string | number;
  py: string | number;
  onClick?: () => void;
};
const Button = ({ name, px, py, onClick }: buttonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={` bg-black text-white hover:bg-gray-500 rounded mx-1`}
      style={{
        paddingLeft: `${px}rem`,
        paddingRight: `${px}rem`,
        paddingTop: `${py}rem`,
        paddingBottom: `${py}rem`,
      }}
    >
      {name}
    </button>
  );
};

export default Button;
