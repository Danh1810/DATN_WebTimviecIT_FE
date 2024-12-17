import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "../../services/axios";
import Select from "react-select";

const FILTERS = [
  {
    label: "Ngành nghề",
    key: "nganhNghe",
    options: ["CNTT", "Kế toán", "Marketing"],
  },
  {
    label: "Kinh nghiệm",
    key: "kinhNghiem",
    options: ["1 năm", "2-3 năm", "Trên 3 năm"],
  },
  {
    label: "Cấp bậc",
    key: "capBac",
    options: ["Nhân viên", "Trưởng nhóm", "Quản lý"],
  },
  {
    label: "Học vấn",
    key: "hocVan",
    options: ["Cao đẳng", "Đại học", "Thạc sĩ"],
  },
  {
    label: "Nơi làm việc",
    key: "noiLamViec",
    options: ["Hà Nội", "Đà Nẵng", "TP.HCM"],
  },
  {
    label: "Hình thức làm việc",
    key: "hinhThuc",
    options: ["Toàn thời gian", "Bán thời gian", "Freelance"],
  },
  { label: "Giới tính", key: "gioiTinh", options: ["Nam", "Nữ", "Khác"] },
  {
    label: "Tình trạng hôn nhân",
    key: "honNhan",
    options: ["Độc thân", "Đã kết hôn"],
  },
];

const Filter = React.memo(({ filters, onFilterChange }) => (
  <div className="p-4 bg-gray-100">
    <h2 className="mb-2 text-lg font-semibold">Bộ lọc nâng cao:</h2>
    {FILTERS.map((filter) => (
      <div key={filter.key} className="mb-4">
        <label className="block mb-1 text-sm">{filter.label}</label>
        <select
          className="w-full px-4 py-2 border rounded"
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
        >
          <option value="">Tất cả {filter.label.toLowerCase()}</option>
          {filter.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>
));

const SearchBar = ({
  cities,
  selectedCity,
  onCityChange,
  onInputChange,
  searchTerm,
  onSearchTermChange,
  onSearch,
}) => (
  <div className="flex items-center gap-4 p-4 bg-white shadow">
    <input
      type="text"
      placeholder="Tìm kiếm"
      className="flex-grow px-4 py-2 border rounded"
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
    />
    <Select
      options={cities}
      value={selectedCity}
      onChange={onCityChange}
      onInputChange={onInputChange}
      placeholder="Chọn hoặc nhập Tỉnh/Thành phố"
      isClearable
      isSearchable
    />
    <button
      className="px-4 py-2 text-white bg-orange-500 rounded"
      onClick={onSearch}
    >
      Tìm kiếm
    </button>
  </div>
);

const HosoxemList = ({ hosoxem, onFavorite, onView }) => (
  <div className="p-4">
    <h2 className="mb-4 text-lg font-semibold">
      Kết quả tìm thấy: {hosoxem.length} hồ sơ
    </h2>
    {hosoxem.map((hs) => (
      <div
        key={hs.id}
        className="p-4 mb-4 bg-white border rounded shadow-sm flex justify-between items-center"
      >
        <div>
          <h3 className="text-lg font-bold">{hs.hoVaTen}</h3>
          <p>{hs.tenhoso}</p>
          <p className="text-gray-500">{hs.trinhDoHocVan}</p>
          <p className="text-gray-500">{hs.kinhNghiemLamViec}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400">
            {new Date(hs.ngayCapNhat).toLocaleDateString()}
          </p>
          <button
            onClick={() => onFavorite(hs.id)}
            className="text-gray-500 hover:text-red-500"
          >
            ❤️
          </button>
          <button
            onClick={() => onView(hs.id)}
            className="ml-4 text-gray-500 hover:text-blue-500"
          >
            👁
          </button>
        </div>
      </div>
    ))}
  </div>
);

function App() {
  const [selectedhosoxem, setSelectedhosoxem] = useState([]);
  const [filteredHosoxem, setFilteredHosoxem] = useState([]);
  const [cities, setCities] = useState([
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "TP.HCM", label: "TP.HCM" },
  ]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchhoso = async () => {
      try {
        const response = await axios.get("/hoso");
        setSelectedhosoxem(response.data);
        setFilteredHosoxem(response.data);
      } catch (error) {
        console.error("Error fetching job seekers:", error);
      }
    };

    fetchhoso();
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    if (selectedOption) {
      const filtered = selectedhosoxem.filter(
        (hs) => hs.nguoitimviec?.thanhPho === selectedOption.value
      );
      setFilteredHosoxem(filtered);
    } else {
      setFilteredHosoxem(selectedhosoxem);
    }
  };

  const handleInputChange = (inputValue) => {
    if (inputValue && !cities.some((city) => city.value === inputValue)) {
      const newCity = { value: inputValue, label: inputValue };
      setCities((prev) => [...prev, newCity]);
    }
  };

  const handleSearch = () => {
    const filtered = selectedhosoxem.filter((hs) => {
      const matchesSearch =
        !searchTerm ||
        hs.hoVaTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hs.tenhoso?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.keys(filters).every((key) => {
        return filters[key] === "" || hs[key]?.toString() === filters[key];
      });

      return matchesSearch && matchesFilters;
    });

    setFilteredHosoxem(filtered);
  };

  const handleFavorite = (id) => {
    // Implement favorite logic
    console.log(`Favorited profile with id: ${id}`);
  };

  const handleView = (id) => {
    // Implement view profile logic
    console.log(`Viewed profile with id: ${id}`);
  };

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-100">
        <Filter filters={filters} onFilterChange={handleFilterChange} />
      </aside>
      <main className="w-3/4">
        <SearchBar
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          onInputChange={handleInputChange}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
        />
        <HosoxemList
          hosoxem={filteredHosoxem}
          onFavorite={handleFavorite}
          onView={handleView}
        />
      </main>
    </div>
  );
}

export default App;
