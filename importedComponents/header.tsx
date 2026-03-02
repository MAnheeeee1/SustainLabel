import React from "react";

type HeaderProps = {
  title: string;
  fontSize?: string;
  alignment?: string;
};

const Header = ({
  title,
  fontSize = "text-8xl",
  alignment = "center",
}: HeaderProps) => {
  const alignClass =
    alignment === "left"
      ? "text-left"
      : alignment === "right"
        ? "text-right"
        : "text-center";

  return (
    <h1 className={`${fontSize} mt-15 mb-5 md:${alignClass} ${alignClass}`}>
      {title}
    </h1>
  );
};

export default Header;
