import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    category: "",
  });

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/events/getevents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allEvents = response.data;
      setEvents(allEvents);
      filterEvents(allEvents, dateFilter, categoryFilter);
    } catch (error) {
      console.error("Error fetching events:", error.response?.data?.message || error.message);
    }
  };

  // Function to filter events based on date and category
  const filterEvents = (allEvents, selectedDate, selectedCategory) => {
    const today = new Date().setHours(0, 0, 0, 0);
    let past = [];
    let upcoming = [];

    allEvents.forEach((event) => {
      const eventDate = new Date(event.date).setHours(0, 0, 0, 0);

      // Apply date filter if selected
      if (selectedDate && eventDate !== new Date(selectedDate).setHours(0, 0, 0, 0)) {
        return;
      }

      // Apply category filter if selected
      if (selectedCategory && event.category !== selectedCategory) {
        return;
      }

      if (eventDate < today) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });

    setPastEvents(past);
    setUpcomingEvents(upcoming);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Apply filtering when date or category changes
  useEffect(() => {
    filterEvents(events, dateFilter, categoryFilter);
  }, [dateFilter, categoryFilter, events]);

  // Function to create a new event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/events/create", newEvent, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setNewEvent({ name: "", description: "", date: "", category: "" });
      fetchEvents(); // Refresh events after creation
    } catch (error) {
      console.error("Error creating event:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-6 py-10">
      {/* Header */}
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-pink-500">
            Welcome!
          </h1>
          <button
            onClick={logout}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Event Filters */}
        <h2 className="text-2xl font-bold text-pink-500 mb-4">Search Events by Filter</h2>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-400 outline-none w-full"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-400 outline-none w-full"
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
          </select>
        </div>

        {/* Upcoming Events */}
        <h2 className="text-2xl font-bold text-green-400 mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event._id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-400">{event.name}</h3>
                <p className="text-gray-300">{event.description}</p>
                <p className="text-sm text-gray-400">
                  <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Category:</strong> {event.category}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No upcoming events.</p>
          )}
        </div>

        {/* Past Events */}
        <h2 className="text-2xl font-bold text-red-500 mt-8 mb-4">Past Events</h2>
        <div className="space-y-4">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <div key={event._id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-red-500">{event.name}</h3>
                <p className="text-gray-300">{event.description}</p>
                <p className="text-sm text-gray-400">
                  <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Category:</strong> {event.category}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No past events.</p>
          )}
        </div>

        {/* Event Form Section */}
        <h2 className="text-2xl font-bold text-pink-500 mt-8 mb-4">
          Create a New Event
        </h2>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-400 outline-none"
          />
          <textarea
            placeholder="Event Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-400 outline-none"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-400 outline-none"
          />
          <select
            value={newEvent.category}
            onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-400 outline-none"
          >
            <option value="">Select Category</option>
            <option value="Tech">Tech</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
          </select>
          <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition duration-300">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
