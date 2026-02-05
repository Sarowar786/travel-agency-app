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
      <div className="border rounded-xl overflow-hidden bg-white shadow-lg">
        <div className="bg-[#8CC72B] text-black p-4">
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
            className="w-full bg-black/95  hover:bg-black/80 text-[#8CC72B] font-bold text-[16px] tracking-wide py-3 rounded-md duration-300 transition"
            onClick={onNavigateMakeBooking}
          >
            MAKE BOOKING
          </button>

          <button className="w-full bg-[#8CC72B] hover:bg-lime-500 text-black font-bold text-[16px]  py-3 rounded-md duration-300 transition">
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
            className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
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
