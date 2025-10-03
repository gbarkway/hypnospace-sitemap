import { render } from 'vitest-browser-react';
import SearchModal from "../SearchModal/SearchModal";
import { it } from 'vitest';

it("renders without crashing", () => {
  render(<SearchModal searchFields={
    {  
      pageNameQuery: "", 
      citizenNameQuery: "", 
      tagsQuery: ""
    }
  }
  show={true}/>);
});
