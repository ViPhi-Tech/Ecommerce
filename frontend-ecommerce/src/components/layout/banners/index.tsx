import Image from "next/image";

interface BannersProps {
   banners: Banner[];
   config: BannersConfig;
}

export type BannersConfig = {
   bannersRow: number;
};

export type Banner = {
   id: number;
   image: string;
   url: string;
};

export default async function Banners({
   banners,
   config: { bannersRow },
}: BannersProps) {
   return (
      <>
         <div className="flex w-full justify-center">
            <div className="container px-0">
               <div className={`grid grid-cols-1 md:grid-cols-${bannersRow}`}>
                  {banners.map((banner: Banner, index: number) => (
                     <div key={index} className="col-span-1 p-4">
                        <img
                           src={banner.image}
                           alt={"banner_" + index}
                           width={0}
                           height={0}
                           style={{
                              width: "auto",
                              maxWidth: "100%",
                              maxHeight: "256px",
                           }}
                        />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </>
   );
}
