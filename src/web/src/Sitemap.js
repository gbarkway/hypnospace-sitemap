import { useEffect, useState, useRef } from "react";
import { Graph } from "react-d3-graph";

export default function Sitemap({ date }) {
    const [data, setData] = useState({
        nodes: [],
        links: [
        ]
    })
    
    const a = useRef();

    useEffect(() => {
        fetch(`http://localhost:3001/captures/${date}`)
            .then((res) => {
                return res.json();
            })
            .then((capture) => {
                const thing = {
                    nodes: capture.pages.map((page) => ({id: page.path})),
                    links: capture.links.map((link) => ({source: link.sourcePath, target: link.targetPath}))
                }
                console.log(thing);
                return thing;
            })
            .then((asdf) => {
                setData(asdf);
            })
            .catch(console.err);
    }, [date]);

    // the graph configuration, just override the ones you need
    const myConfig = {
        height: 800,
        d3: {
            //disableLinkForce: true,
        }
    };
    
    const onClickNode = function(nodeId) {
        window.alert(`Clicked node ${nodeId}`);
    };
    
    const onClickLink = function(source, target) {
        window.alert(`Clicked link between ${source} and ${target}`);
    };

    return (<Graph
            id="graph-id" // id is mandatory
            data={data}
            config={myConfig}
            ref={a}
            />);
}