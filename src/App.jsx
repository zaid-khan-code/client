import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    async function fetchEmployee() {
      try {
        fetch("http://localhost:3000/api/employees")
          .then((response) => response.json())
          .then((data) => console.log(data));
      } catch (error) {}
    }
    fetchEmployee();
  }, []);
  return <>Hellow Workd</>;
}

export default App;
