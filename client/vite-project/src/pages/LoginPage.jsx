import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios({
        method: "POST",
        url: "http://localhost:3000/login",
        data: {
          email,
        },
      });
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
      console.log(data, "<< Ini Data nya");
    } catch (err) {
      console.log("🚀 ~ handleOnSubmit ~ err:", err);
    }
  };

  const handleCredentialResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    try{
      let {data} = await axios.post(`http://localhost:3000/google-login`, {}, {
        headers: {
          googletoken: response.credential
        }
      })

      console.log(data, "here google login")
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch(e) {
    console.log("🚀 ~ handleCredentialResponse ~ e:", e)
    }
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
  })
  
  return (
    <div className="d-flex justify-content-center align-items-center bg-gray-200 h-screen">
      <form onSubmit={handleOnSubmit} className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96 md:w-1/3 mx-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <div className="mb-4">
          <label
            htmlFor="email-address-icon"
            className="block text-sm font-medium text-gray-700"
          >
            Your Email
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
            <input
              type="text"
              id="email-address-icon"
              className="block w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
            Submit
          </button>
        </div>

        <div className="flex justify-center items-center mb-4">
          <div id="buttonDiv" className="w-full"></div>
        </div>
      </form>
    </div>
  );
}
