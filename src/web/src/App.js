import './App.css';
import {useState} from "react";
import PageDetails from "./PageDetails";
import DatePicker from "./DatePicker";
import Sitemap from "./Sitemap";

function App() {
  const [date, setDate] = useState("1999-11-05"); // TODO: use context
  const [path, setPath] = useState("99_flist\\~f00021d_01.hsp");
  return (
    <div className="App">
      <div className="DatePickerContainer">
        <DatePicker value={date} onDatePicked={setDate}/>
      </div>
      <div>
        <Sitemap date={date} onTap={setPath}/>
      </div>
      <div className="PageDetailsContainer">
        <PageDetails date={date} path={path}/>
      </div>
    </div>
  );
}

export default App;
