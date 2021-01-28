import {useState, useEffect} from "react";

export default function DatePicker({value, onDatePicked}) {
    const [dates, setDates] = useState([]);
    const [currentDate, setCurrentDate] = useState(value);

    useEffect(() => {
        console.log('calling service')
        fetch(`http://localhost:3000/captures`)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error(res);
                }
            })
            .then((ds) => {
                setDates(ds);
            })
            .catch(console.err);
    }, []);

    const onChange = (e) => {
        //console.log(e.target.value);
        setCurrentDate(e.target.value);
        onDatePicked(e.target.value);
    };

    return (
        <select name="date" id="date-select" value={currentDate} onChange={onChange}>
            {dates.map((d, i) => (
                <option value={d} key={`date-select${i}`}>{d}</option>
            ))}
        </select>
    );
}