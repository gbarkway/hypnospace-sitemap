import {useState, useEffect} from "react";
import {Form} from "react-bootstrap";

export default function DatePicker({value, onDatePicked}) {
    const [dates, setDates] = useState([]);
    const [currentDate, setCurrentDate] = useState(value);

    useEffect(() => {
        fetch(`http://localhost:3000/captures`)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return [];
                }
            })
            .then(setDates)
            .catch(console.err);
    }, []);

    const onChange = (e) => {
        setCurrentDate(e.target.value);
        onDatePicked(e.target.value);
    };

    return (
        <Form.Control as="select" size="sm" value={currentDate} onChange={onChange} id="dat-select">
            {dates.map((d, i) => (
                <option value={d} key={`date-select${i}`}>{d}</option>
            ))}
        </Form.Control>
    );
}