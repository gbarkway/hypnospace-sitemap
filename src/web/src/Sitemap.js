import { useEffect, useState } from "react";
import { Graph } from "react-d3-graph";

export default function Sitemap({ date }) {
    const [data, setData] = useState({
        nodes: [{id: "Test1"}, {id: "Test2"}],
        links: [
            { source: "Test1", target: "Test2"}
        ]
    })
    
    useEffect(() => {
        fetch(`http://localhost:3001/captures/${date}`)
            .then((res) => {
                return res.json();
            })
            .then((capture) => {
                return {
                    nodes: capture.pages.map((page) => ({id: page.path})),
                    links: capture.links.map((link) => ({source: link.sourcePath, target: link.targetPath}))
                }
            })
            .then((asdf) => {
                setData(asdf);
            })
            .catch(console.err);
    }, [date]);

    // the graph configuration, just override the ones you need
    const myConfig = {
        nodeHighlightBehavior: true,
        node: {
        color: "lightgreen",
        size: 120,
        highlightStrokeColor: "blue",
        },
        link: {
        highlightColor: "lightblue",
        },
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
            onClickNode={onClickNode}
            onClickLink={onClickLink}
            />);
}