import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
      <h1 className="text-4xl font-extrabold text-pink-500 mb-4 text-center">
        Welcome to the Event Management Platform
      </h1>
      <p className="text-lg text-gray-300 mb-6 text-center">
        <Link to="/login" className="text-pink-400 hover:text-pink-300 transition font-semibold">
          Login
        </Link>{" "}
        or{" "}
        <Link to="/register" className="text-pink-400 hover:text-pink-300 transition font-semibold">
          Register
        </Link>{" "}
        to get started.
      </p>
    </div>
  );
};

export default Home;
