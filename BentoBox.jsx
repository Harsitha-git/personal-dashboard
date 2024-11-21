import React, { useState, useEffect } from "react";
import axios from "axios";
import SocialLinksBox from "./SocialLinksBox";
import TodoList from "./TodoList";
import ScheduleComponent from "./ScheduleComponent";
import HabitTracker from "./HabitTracker";
import ProfileBox from "./ProfileBox";



const BentoBox = () => {
  const [formData, setFormData] = useState({
    reading: [],
    watching: [],
    listening: [],
    profileImage: "",
  });

  const [searchResults, setSearchResults] = useState({
    reading: [],
    watching: [],
    listening: [],
  });

  const [backgroundColor, setBackgroundColor] = useState("#000000");

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("spaceBentoBoxData");
    const savedColor = localStorage.getItem("spaceBentoBoxColor");

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    if (savedColor) {
      setBackgroundColor(savedColor);
    }
  }, []);

  // Save formData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("spaceBentoBoxData", JSON.stringify(formData));
  }, [formData]);

  // Save backgroundColor to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("spaceBentoBoxColor", backgroundColor);
  }, [backgroundColor]);

  const handleSearch = async (type, query) => {
    if (query.length < 3) return;

    let url = "";
    let results = [];

    if (type === "reading") {
      url = `INSERT API HERE`;
    } else if (type === "watching") {
      url = `INSERT API HERE`;
    } else if (type === "listening") {
      url = `INSERT API HERE`;
    }

    try {
      const response = await axios.get(url);

      if (type === "reading") {
        results =
          response.data.items?.map((item) => ({
            title: item.volumeInfo?.title || "Unknown Title",
            image: item.volumeInfo?.imageLinks?.thumbnail || "",
          })) || [];
      } else if (type === "watching") {
        results =
          response.data.results?.map((item) => ({
            title: item.title || item.name || "Unknown Title",
            image: item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : "",
          })) || [];
      } else if (type === "listening") {
        results =
          response.data.results?.map((item) => ({
            title: item.trackName || "Unknown Title",
            image: item.artworkUrl100 || "",
          })) || [];
      }

      setSearchResults((prev) => ({ ...prev, [type]: results }));
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
    }
  };

  const handleSelect = (type, item) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], item],
    }));
    setSearchResults((prev) => ({ ...prev, [type]: [] }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleRemoveItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div
      style={{ backgroundColor }}
      className="z-0 w-auto h-fit lg:w-screen lg:h-screen grid gap-4 
      p-4 grid-cols-1 md:grid-cols-4 auto-rows-fr"
    >
      {/* Profile Picture */}
      <div
        className="bg-blue-300 bg-opacity-50 rounded-lg 
        col-span-2 lg:col-auto flex flex-col items-center justify-center p-6 shadow-lg"
      >
        <ProfileBox
          backgroundColor={backgroundColor}
          onChangeBackground={setBackgroundColor}
        />
      </div>

      {/* Currently Listening */}
      <div
        className="bg-white shadow-md border border-gray-600 border-opacity-30  
      rounded-lg col-span-2 overflow-scroll"
      
      >
    
        <ContentBox
          title="Currently Listening"
          type="listening"
          formData={formData}
          searchResults={searchResults}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onRemove={handleRemoveItem}
          placeholder="Search for a song..."
        />
      </div>

      {/* To-Do List */}
      <div
        className="bg-white shadow-md border border-gray-600 border-opacity-30  
      lg:overflow-scroll rounded-lg max-w-screen flex flex-col col-span-2 lg:col-auto items-center justify-center 
      p-4"
      >
        <TodoList />
      </div>

      {/* Currently Reading */}
      
      <div
        className="col-span-2 overflow-scroll bg-white rounded-lg
      border border-gray-600 border-opacity-30 shadow-md"
      
      
      >
       
       <ContentBox
          title="Currently Reading"
          type="reading"
          formData={formData}
          searchResults={searchResults}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onRemove={handleRemoveItem}
          placeholder="Search for a book..."
        />
      </div>

      {/* Currently Watching */}
      <div
        className="w-auto h-auto col-span-2 bg-white shadow-md 
      border border-gray-600 border-opacity-30  rounded-lg overflow-scroll"
      >
       
       <ContentBox
          title="Currently Watching"
          type="watching"
          formData={formData}
          searchResults={searchResults}
          onSearch={handleSearch}
          onSelect={handleSelect}
          onRemove={handleRemoveItem}
          placeholder="Search for a movie or show..."
        />
      </div>

      {/* Empty Box */}
      <div
        className="bg-white shadow-md border border-gray-600 border-opacity-30 
      lg:overflow-scroll rounded-lg max-w-screen flex flex-col col-span-2 lg:col-auto items-center justify-center 
      p-4"
      >
        <ScheduleComponent />
      </div>

      {/* Habit Tracker */}
      <div
        className="bg-white shadow-md border border-gray-600 border-opacity-30  
      rounded-lg max-w-screen flex flex-col col-span-2 lg:col-auto items-center justify-center 
      p-4 overflow-scroll"
      >
        <HabitTracker />
      </div>

      {/* Social Links */}
      <div
        className="bg-white shadow-md border border-gray-600 border-opacity-30  
      rounded-lg col-span-2 flex items-center justify-center p-4"
      >
        <SocialLinksBox />
      </div>
    </div>
  );
};

const ContentBox = ({ title, type, formData, searchResults, onSearch, onSelect, onRemove, placeholder }) => (
  <div className="rounded-lg flex flex-col items-center justify-center p-4 py-8">
    <h2 className="text-center text-lg font-bold mb-4">{title}</h2>
    <SearchBox
      type={type}
      placeholder={placeholder}
      onSearch={onSearch}
      results={searchResults[type]}
      onSelect={onSelect}
    />

    <ul className="mt-4 w-fit max-w-[90%] sm:max-w-sm mx-auto mb-4 space-y-2">
      {formData[type].map((item, index) => (
        <li
          key={index}
          className="flex items-center gap-28 p-2 bg-white bg-opacity-70 rounded-lg shadow-md"
        >
          <div className="flex items-center">
            {item.image && (
              <img src={item.image} alt={item.title} className="w-16 h-16 mr-2 rounded-md" />
            )}
            <span className="text-sm">{item.title}</span>
          </div>
          <button
            onClick={() => onRemove(type, index)}
            className="text-xs hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
            </svg>
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const SearchBox = ({ type, placeholder, onSearch, results, onSelect }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        onSearch(type, query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, type, onSearch]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute mt-2 w-full bg-white z-10 shadow-md">
        {results.length > 0 &&
          results.map((result, index) => (
            <div
              key={index}
              onClick={() => {
                onSelect(type, result);
                setQuery("");
              }}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              <img src={result.image} alt={result.title} className="w-8 h-8 inline-block mr-2" />
              {result.title}
            </div>
          ))}
      </div>
    </div>
  );
};

export default BentoBox;
