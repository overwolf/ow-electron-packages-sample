import React from "react";

type IconProps = {
  name: string;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, className }) => (
  <svg className={className} >
    <use href={`#${name}`} />
  </svg>
);

export default Icon;
