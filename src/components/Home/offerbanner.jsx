import Image from "next/image";

const offers = [
  {
    image: "/images/2.jpg",
    title: "APLB Collagen Peptide Beauty Tablet",
    subtitle: "500mg x 30 Tablets",
    price: "1250 BDT",
  },
  {
    image: "/images/1.jpg",
    title: "SOME BY MI Cica Peptide Shampoo",
    subtitle: "285ml",
    price: "2300 BDT",
  },
];

export default function OfferBanner() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Special Offers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div key={offer.title} className="relative rounded-2xl overflow-hidden shadow-md h-64 md:h-80 flex items-center">
            <Image
              src={offer.image}
              alt={offer.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="relative z-10 w-full h-full px-6 py-8 text-white flex flex-col justify-center bg-black/25">
              <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded w-max mb-2">
                SPECIAL OFFER
              </span>

              <h2 className="text-xl md:text-2xl font-bold leading-tight mb-1">
                {offer.title}
              </h2>
              <p className="text-sm mb-4">{offer.subtitle}</p>

              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded">
                  Buy Now {offer.price}
                </button>
                <button className="text-white text-sm underline hover:text-pink-100 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
