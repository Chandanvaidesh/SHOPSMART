function TagList({ filters, setFilters, options }) {
  const toggleFilter = (filter) => {
    setFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {options.map((filter, idx) => (
        <button
          key={idx}
          onClick={() => toggleFilter(filter)}
          className={`px-3 py-1 rounded-full text-sm ${
            filters.includes(filter)
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default TagList;
