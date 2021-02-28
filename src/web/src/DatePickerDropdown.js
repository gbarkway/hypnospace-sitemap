import {useState, useEffect} from "react";
import {NavDropdown} from "react-bootstrap";

export default function DatePickerDropdown({value, onDatePicked}) {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_CAPTURE_SERV_URL}/captures`)
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
        onDatePicked(e);
    };

    return (
        <NavDropdown className="btn btn-secondary mx-1" title={value}>
            {dates.map((d, i) => (
                <NavDropdown.Item 
                    eventKey={`${i+10}`}
                    key={`date-select${i}`}
                    onClick={() => onChange(d)}>{d}</NavDropdown.Item>
            ))}
        </NavDropdown>
    );
}