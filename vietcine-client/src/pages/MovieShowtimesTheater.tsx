import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Cinema {
  id: number;
  name: string;
  logo?: string;
  slug?: string;
  theaterBrand: CinemaBrand;
  address?: string;
  city?: string;
  totalScreens?: number;
}

interface Genre {
  id: number;
  name: string;
}

interface Screen {
  id: number;
  screenNumber: string;
  totalSeats: number;
  theater: {
    id: number;
    name: string;
    address: string;
    city: string;
    totalScreens: number;
    theaterBrandId: number;
  };
}

interface Showtime {
  id: number;
  startTime: string;
  endTime: string;
  screen: Screen;
  availableSeats: string;
}

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  rating: number;
  duration: number;
  slug: string;
  genres: Genre[];
  showtimes: Showtime[];
}

interface CinemaBrand {
  id: number;
  theaterBrandName: string;
  logo: string;
}

export default function MovieShowtimes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | "all">("all");
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [cinemaBrands, setCinemaBrands] = useState<CinemaBrand[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [brandsLoaded, setBrandsLoaded] = useState<boolean>(false);

  const handleBookTicket = (showtimeId: number, movieId: number) => {
    navigate(`/seat-selection?movieId=${movieId}&showtimeId=${showtimeId}`);
  };

  // Generate dates for the next 7 days in UTC+7
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Format date to YYYY-MM-DD in UTC+7
      const parts = formatter.formatToParts(date);
      const formattedDate = `${parts[4].value}-${parts[0].value}-${parts[2].value}`; // YYYY-MM-DD

      const day = date.getDate();
      const dayName =
        i === 0
          ? "Hôm nay"
          : ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][
              date.getDay()
            ];

      dates.push({
        date: formattedDate,
        day,
        dayName,
      });
    }

    return dates;
  };

  const dates = generateDates();

  useEffect(() => {
    // Fetch cities on component mount and set default date
    fetchCities();
    setSelectedDate(dates[0].date);
  }, []);

  useEffect(() => {
    if (city) {
      fetchCinemaBrands(city);
    }
  }, [city]);

  useEffect(() => {
    if (city && brandsLoaded) {
      fetchCinemas();
    }
  }, [city, selectedBrand, brandsLoaded]);

  useEffect(() => {
    if (selectedBrand !== "all") {
      setSelectedCinema(null);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedCinema !== null && selectedDate) {
      fetchMovieShowtimes();
    }
  }, [selectedCinema, selectedDate]);

  useEffect(() => {
    setSelectedCinema(null); // Reset when city changes
    if (city) {
      fetchCinemaBrands(city);
    }
  }, [city]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "http://localhost:8081/api/theaters/cities"
      );
      if (response.data.success) {
        setCities(response.data.data);
        const defaultCity = response.data.data.includes("Hồ Chí Minh")
          ? "Hồ Chí Minh"
          : response.data.data[0] || "";
        setCity(defaultCity);
      } else {
        setError("Không thể tải danh sách tỉnh/thành phố");
      }
      setLoading(false);
    } catch (err) {
      setError("Lỗi khi lấy danh sách tỉnh/thành phố");
      setLoading(false);
      console.error("Error fetching cities:", err);
    }
  };

  const fetchCinemaBrands = async (selectedCity: string) => {
    try {
      setLoading(true);
      setError(null);
      setBrandsLoaded(false);

      const response = await axios.get(
        `http://localhost:8081/api/theater-brands?city=${encodeURIComponent(
          selectedCity
        )}`
      );
      if (response.data.success) {
        setCinemaBrands(response.data.data);
        setBrandsLoaded(true);
      } else {
        setError("Không thể tải danh sách hệ thống rạp");
        setBrandsLoaded(true);
      }
      setLoading(false);
    } catch (err) {
      setError("Lỗi khi lấy danh sách hệ thống rạp");
      setLoading(false);
      setBrandsLoaded(true);
      console.error("Error fetching cinema brands:", err);
    }
  };

  const fetchCinemas = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `http://localhost:8081/api/theaters/all?city=${encodeURIComponent(
        city
      )}`;
      if (selectedBrand !== "all") {
        url = `http://localhost:8081/api/theaters?brandId=${selectedBrand}&city=${encodeURIComponent(
          city
        )}`;
      }

      const response = await axios.get(url);
      if (response.data.success) {
        const fetchedCinemas: Cinema[] = response.data.data.map(
          (cinema: any) => {
            const brand = cinemaBrands.find(
              (b) => b.id === cinema.theaterBrandId
            );
            return {
              id: cinema.id,
              name: cinema.name,
              logo: cinema.theaterBrand.logo || "/placeholder.svg",
              slug: cinema.name.toLowerCase().replace(/\s+/g, "-"),
              theaterBrand: brand || {
                id: cinema.theaterBrand.id,
                theaterBrandName: cinema.theaterBrand.theaterBrandName,
                logo: cinema.theaterBrand.logo,
              },
              address: cinema.address,
              city: cinema.city,
              totalScreens: cinema.totalScreens,
            };
          }
        );
        setCinemas(fetchedCinemas);
      } else {
        setError("Không thể tải danh sách rạp chiếu phim");
      }
      setLoading(false);
    } catch (err) {
      setError("Lỗi khi lấy danh sách rạp chiếu phim");
      setLoading(false);
      console.error("Error fetching cinemas:", err);
    }
  };

  const extractTime = (isoString: string) => {
    if (!isoString || !isoString.includes("T")) return "N/A";
    try {
      const date = new Date(isoString);
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return date.toLocaleTimeString("en-US", options).substring(0, 5);
    } catch (error) {
      console.error("Error extracting time:", error);
      return "N/A";
    }
  };

  const fetchMovieShowtimes = async () => {
    if (!selectedCinema || !selectedDate) return;

    try {
      setLoading(true);
      setError(null);
      setMovies([]);

      // Log date to ensure correct format
      console.log("Sending date to API:", selectedDate);
      const url = `http://localhost:8081/api/theaters/${selectedCinema}/movies?date=${encodeURIComponent(
        selectedDate
      )}`;
      const response = await axios.get(url);

      if (response.data.success) {
        setMovies(response.data.data);
      } else {
        setError("Không thể tải lịch chiếu phim");
      }
      setLoading(false);
    } catch (err) {
      setError("Lỗi khi lấy lịch chiếu phim");
      setLoading(false);
      console.error("Error fetching movie showtimes:", err);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleBrandChange = (brandId: number | "all") => {
    setSelectedBrand(brandId);
    setSelectedCinema(null);
  };

  const handleCinemaChange = (cinemaId: number) => {
    setSelectedCinema(cinemaId);
  };

  const filterCinemasBySearch = () => {
    let filteredCinemas = cinemas;

    if (selectedBrand !== "all") {
      filteredCinemas = filteredCinemas.filter(
        (cinema) =>
          cinema.theaterBrand.id.toString() === selectedBrand.toString()
      );
    }

    if (searchQuery) {
      filteredCinemas = filteredCinemas.filter((cinema) =>
        cinema.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filteredCinemas = filteredCinemas.filter((cinema) => cinema.city === city);

    return filteredCinemas;
  };

  const selectedCinemaDetails =
    selectedCinema !== null
      ? cinemas.find((cinema) => cinema.id === selectedCinema)
      : null;

  const getSelectedBrandLogo = () => {
    if (selectedBrand === "all") return null;
    const brand = cinemaBrands.find((b) => b.id === selectedBrand);
    return brand?.logo || "/placeholder.svg";
  };

  return (
    <div
      className="bg-black text-white min-h-screen"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80)`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <NavBar transparent={false} fixedTop={true} />
      <div className="relative min-h-screen w-full pt-20">
        <div className="absolute inset-0 bg-black/80 z-0"></div>
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-red-500 mb-10">
              Lịch chiếu phim
            </h1>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-10">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Vị trí
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {cities.map((cityName, index) => (
                        <option key={index} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                     
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm theo tên rạp ..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-white text-lg mb-3">
                  Hệ thống rạp chiếu phim
                </h3>
                <div className="flex flex-wrap gap-3 items-center mb-6">
                  <button
                    onClick={() => handleBrandChange("all")}
                    className={`flex flex-col items-center p-2 rounded-md transition duration-300 ${
                      selectedBrand === "all"
                        ? "bg-white/20 border-2 border-red-500"
                        : "bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full mb-1">
                      <svg
                        className="w-6 h-6 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-center">Tất cả</span>
                  </button>
                  {cinemaBrands.map((brand) => (
                    <button
                      key={brand.id}
                      data-testid={`brand-btn-${brand.id}`}
                      onClick={() => handleBrandChange(brand.id)}
                      className={`flex flex-col items-center p-2 rounded-md transition duration-300 ${
                        selectedBrand === brand.id
                          ? "bg-white/20 border-2 border-red-500"
                          : "bg-white/10 hover:bg-white/15"
                      }`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg mb-1 p-1">
                        <img
                          src={brand.logo || "/placeholder.svg"}
                          alt={brand.theaterBrandName}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <span className="text-xs text-center">
                        {brand.theaterBrandName.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {!selectedCinema && (
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-10">
                <div className="flex items-center mb-6">
                  {selectedBrand !== "all" ? (
                    <img
                      src={getSelectedBrandLogo() || "/placeholder.svg"}
                      alt={`${
                        cinemaBrands.find((b) => b.id === selectedBrand)
                          ?.theaterBrandName
                      } Logo`}
                      className="w-12 h-12 object-contain bg-white rounded-md p-1 mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full mr-4">
                      <svg
                        className="w-6 h-6 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedBrand !== "all"
                        ? `Rạp chiếu phim ${
                            cinemaBrands.find((b) => b.id === selectedBrand)
                              ?.theaterBrandName
                          }`
                        : "Lịch chiếu phim - Tất cả hệ thống rạp"}
                    </h2>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-white text-lg mb-4">
                    Chọn rạp để xem lịch chiếu
                  </h3>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      {filterCinemasBySearch().map((cinema) => (
                        <button
                          key={cinema.id}
                          data-testid={`cinema-btn-${cinema.id}`}
                          onClick={() => handleCinemaChange(cinema.id)}
                          className="flex items-center p-4 rounded-lg transition duration-300 hover:bg-white/10"
                        >
                          <div className="w-10 h-10 flex-shrink-0 bg-white rounded-md overflow-hidden mr-4">
                            <img
                              src={cinema.logo || "/placeholder.svg"}
                              alt={cinema.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-left">
                            <h3 className="text-white">{cinema.name}</h3>
                            <p className="text-gray-400 text-sm">
                              {cinema.address || "Địa chỉ không có sẵn"}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </div>
                        </button>
                      ))}
                      {filterCinemasBySearch().length === 0 && !loading && (
                        <div className="text-gray-400 text-center py-4">
                          Không tìm thấy rạp phù hợp với tìm kiếm của bạn.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {selectedCinema && (
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-10">
                <div className="flex items-center mb-6">
                  <img
                    src={selectedCinemaDetails?.logo || "/placeholder.svg"}
                    alt={`${selectedCinemaDetails?.name} Logo`}
                    className="w-12 h-12 object-contain bg-white rounded-md p-1 mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Lịch chiếu phim {selectedCinemaDetails?.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {selectedCinemaDetails?.address || ""}
                      {selectedCinemaDetails?.address && (
                        <span className="text-blue-400 ml-2 cursor-pointer">
                          [Bản đồ]
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCinema(null)}
                    className="ml-auto text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-8">
                  {dates.map((dateInfo, index) => (
                    <button
                      key={index}
                      data-testid={`date-btn-${dateInfo.date}`}
                      onClick={() => handleDateChange(dateInfo.date)}
                      className={`flex flex-col items-center justify-center py-3 rounded-lg transition duration-300 ${
                        selectedDate === dateInfo.date
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 hover:bg-gray-700 text-white"
                      }`}
                    >
                      <span className="text-lg font-bold">{dateInfo.day}</span>
                      <span className="text-xs mt-1">{dateInfo.dayName}</span>
                    </button>
                  ))}
                </div>
                {loading ? (
                  <div className="flex flex-col justify-center items-center h-64">
                    <div className="flex space-x-2 mb-2">
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                    </div>
                    <div className="text-white">
                      Đang tải lịch chiếu phim...
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-red-500">{error}</div>
                  </div>
                ) : movies.length === 0 ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400">
                      Không có lịch chiếu phim nào cho ngày đã chọn
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {movies.map((movie) => (
                      <div
                        key={movie.id}
                        className="bg-gray-900/80 rounded-lg p-6"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0 w-full md:w-64">
                            <div
                              className="relative group cursor-pointer"
                              onClick={() => navigate(`/movies/${movie.slug}`)}
                            >
                              <div className="aspect-[2/3] overflow-hidden rounded-lg">
                                <img
                                  src={movie.posterUrl || "/placeholder.svg"}
                                  alt={movie.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                              {movie.rating && (
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-sm font-semibold py-1 px-2 rounded">
                                  {movie.rating}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {movie.title}
                            </h3>
                            <div className="text-gray-400 mb-4">
                              {movie.genres
                                .map((genre) => genre.name)
                                .join(", ")}
                            </div>
                            <div className="mb-3 text-white font-medium">
                              {movie.showtimes.length > 0 ? "2D Phụ đề" : ""}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                              {movie.showtimes.map((showtime) => (
                                <button
                                  key={showtime.id}
                                  data-testid={`showtime-btn-${showtime.id}`}
                                  className="bg-gray-800 hover:bg-gray-700 transition duration-300 rounded-lg p-3 text-center"
                                  onClick={() =>
                                    handleBookTicket(showtime.id, movie.id)
                                  }
                                >
                                  <div className="text-white font-medium">
                                    {extractTime(showtime.startTime)} -{" "}
                                    {extractTime(showtime.endTime)}
                                  </div>
                                  <div className="text-gray-400 text-xs mt-1">
                                    {showtime.screen.screenNumber}
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    {showtime.screen.totalSeats} ghế
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
