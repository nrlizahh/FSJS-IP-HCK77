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
      // Replace YOUR_GOOGLE_CLIENT_ID with your own client_id obtained from step 1
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      // Callback function to handle the response
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      // Get the element where the button will be rendered; this must exist in the DOM
      document.getElementById("buttonDiv"),
      // Customize the Google button attributes
      { theme: "outline", size: "large" }
    );
    // Display the One Tap dialog; comment out to remove the dialog
    // google.accounts.id.prompt();
  })
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <form onSubmit={handleOnSubmit} className="max-w-sm mx-auto">
        <label
          htmlFor="email-address-icon"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3 form-check"></div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <div id="buttonDiv">Log In</div>
      </form>
    </div>
  );
}
