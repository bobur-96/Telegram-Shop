import "./App.css";
import Card from "./components/card/card";
import { getData } from "./constants/db";

const courses = getData();

const App = () => {
  return (
    <>
      <h1 className="heading">Sammi kurslar</h1>

      {/* Cart */}
      <div className="cards_container">
        {courses.map((course) => (
          <Card key={course.id} course={course} />
        ))}
      </div>
    </>
  );
};

export default App;
