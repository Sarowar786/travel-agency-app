type TourCard = {
  id: number
  title: string
  image: string
  price: number
  isNew?: boolean
}

const tours: TourCard[] = [
  {
    id: 1,
    title: "5D MYSTERIOUS CHIANG MAI + CHIANG RAI",
    image: "../images/changsha-food.jpg",
    price: 998,
  },
  {
    id: 2,
    title: "6D SCENIC BORNEO / SABAH DANUM",
    image: "../images/changsha-food.jpg",
    price: 2995,
  },
  {
    id: 3,
    title: "7D TIANMENSHAN + ZHANGJIAE AND RED TOWN",
    image: "../images/changsha-food.jpg",
    price: 1998,
    isNew: true,
  },
]

interface BookingSidebarProps {
  onNavigateMakeBooking: () => void;
}

const BookingSidebar = ({ onNavigateMakeBooking }: BookingSidebarProps) => {
  return (
    <aside className="w-full space-y-6 sticky top-6">
      {/* PRICE CARD */}
      <div className="border border-brand-sand rounded-xl overflow-hidden bg-white shadow-lg">
        <div className="bg-brand-green text-black p-4">
          <p className="text-xs tracking-wide uppercase">Closing</p>
          <p className="text-3xl font-bold">$1,548</p>
        </div>

        <div className="px-4 py-6 space-y-3 text-sm">
          <p className="flex items-center gap-2 text-gray-600">
            📞 (+65) 6838 0001
          </p>
          <p className="flex items-center gap-2 text-gray-600">
            📞 (+65) 9777 0960
          </p>

          <button 
            className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-brand-green text-brand-navy hover:bg-[#8cc72b] hover:scale-[1.02]"
            onClick={onNavigateMakeBooking}
          >
            MAKE BOOKING
          </button>

          <button className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-brand-navy text-brand-green hover:bg-brand-navy/90 hover:text-white hover:scale-[1.02]">
            ⬇ ITINERARY DOWNLOAD
          </button>

          <button className="text-xs text-teal-600 w-full mx-auto hover:underline">
            ✉ EMAIL THIS PAGE
          </button>
        </div>
      </div>

      {/* TOURS YOU MAY LIKE */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-700">
          TOURS YOU MAY LIKE
        </p>

        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white border border-brand-sand rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <div className="relative">
              {tour.isNew && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded">
                  NEW
                </span>
              )}
              <img
                src={tour.image}
                alt={tour.title}
                className="h-32 w-full object-cover"
              />
            </div>

            <div className="p-3">
              <p className="text-xs font-medium leading-snug mb-1">
                {tour.title}
              </p>
              <p className="text-sm font-semibold text-orange-600">
                ${tour.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default BookingSidebar
