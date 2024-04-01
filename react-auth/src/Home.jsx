import axios from "axios";
import { useState } from "react";
function Home() {
  const [userData, setUserData] = useState();

  const refreshTheAccessToken = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/auth/refreshthetoken",
        withCredentials: true,
      });
      const newAccessToken = response.data.accessToken;
      return newAccessToken;
    } catch (err) {
      console.log("somthing went wrong!!! " + err);
    }
  };

  const getUserProfile = async () => {
    const accessToken = await refreshTheAccessToken();
    try {
      axios
        .get("http://localhost:3000/user/profile", {
          withCredentials: true,
          headers: { "Authorization": accessToken },
        })
        .then(function (response) {
          setUserData(response.data.message);
        });
    } catch {
      console.log("somthing went wrong");
    }
  };

  getUserProfile();

  const logOut = async () => {
    try {
      console.log("in the try section");
      axios
        .delete("http://localhost:3000/auth/logout", {
          withCredentials: true,
        })
        .then(setUserData());
    } catch {
      console.log("somthing went wrong couldnt logout");
    }
  };

  return (
    <>
      <div className="text-4xl text-amber-400">Home</div>
      <h1>{userData}</h1>

      <button onClick={logOut}>logout</button>
    </>
  );
}

export default Home;
