import Header from "./header";
import DppLayout from "./dppLayout";
import ProductImage from "./productImage";
import ThreeKeyFacts from "./threeKeyFacts";
import DropdownModule from "./popDownInfo";
import MinimalFooter from "./minimalFooter";
import MoreProductSection from "./moreProductSection";
import NewCollection from "./newCollection";
import Head from "next/head";
export default function DppTemplate() {
  const listofFacts = [
    { keyFact: "8600mil", value: "Sträcka" },
    { keyFact: "0.17kg", value: "Co2" },
    { keyFact: "52", value: "Delar" },
  ];
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
      <div>
        <DppLayout>
          <Header title={"Saga"} />
          <hr />
          <ProductImage
            imageUrl={"/jacka.png"}
            height={300}
            width={300}
            position={"center"}
          />
          <ThreeKeyFacts listofFacts={listofFacts} />

          <DropdownModule />
          <MoreProductSection />
          <NewCollection />
          <MinimalFooter />
        </DppLayout>
      </div>
    </div>
  );
}
