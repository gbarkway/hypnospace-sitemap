import {Button} from "react-bootstrap"

import MutedNoneText from "./MutedNoneText"

export default function Tags({ tags, onTagClick }) {
    if (!tags.length) {
      return (
        <>
          <b>Tags: </b>
          <MutedNoneText />
        </>
      );
    }
  
    return (
      <>
        <b>Tags: </b>
        {tags.map((t, i) => (
          <Button onClick={() => onTagClick(t)} variant="link" key={`tag-${i}`}>
            &gt;{t}
          </Button>
        ))}
      </>
    );
}