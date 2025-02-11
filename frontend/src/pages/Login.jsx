import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-pink-500 text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-pink-400 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>
          <button
  onClick={() => navigate("/dashboard")}
  className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition duration-300"
>
  Guest Login
</button>

        </form>
        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-pink-400 hover:text-pink-300 font-semibold transition"
          >
            Register
          </button>
          
        </p>
      </div>
    </div>
  );
};

export default Login;
