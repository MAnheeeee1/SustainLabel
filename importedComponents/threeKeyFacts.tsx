import React from "react";
import { Knewave } from "next/font/google";

const knewwave = Knewave({ weight: "400" });
type ThreeKeyFactsProps = {
  listofFacts: Fact[];
  bgColor?: string;
  accentColor?: string;
};
interface Fact {
  keyFact: string;
  value: string;
}
const ThreeKeyFacts = ({
  listofFacts,
  bgColor = "#E2E2E2",
  accentColor = "text-green-800",
}: ThreeKeyFactsProps) => {
  return (
    <div className="p-2 ">
      <div
        className="flex justify-center p-6 items-center rounded-2xl"
        style={{ backgroundColor: bgColor }}
      >
        <div className={"flex w-full justify-between "}>
          {listofFacts.map((fact, index) => (
            <div key={index}>
              <h1
                className={
                  "text-center text-4xl " +
                  accentColor +
                  " " +
                  knewwave.className
                }
              >
                {fact.keyFact}
              </h1>
              <div>
                <p className={"text-center text-2xl"}>{fact.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeKeyFacts;
