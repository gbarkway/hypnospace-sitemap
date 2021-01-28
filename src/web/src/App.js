import './App.css';
import {useState} from "react";
import PageDetails from "./PageDetails";
import DatePicker from "./DatePicker";

function App() {
  const [date, setDate] = useState("1999-11-05");
  return (
    <div className="App">
      <div className="DatePickerContainer">
        <DatePicker value={date} onDatePicked={setDate}/>
      </div>
      <div className="PageDetailsContainer">
        <PageDetails date={date} path="99_flist\~f00021d_01.hsp"/>
      </div>
    </div>
  );
}

export default App;
