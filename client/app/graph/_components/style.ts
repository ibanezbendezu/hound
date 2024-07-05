export const expandNodeStyle = {
    "background-color": "#444444",
    "text-valign": "top",
};

export const graphStyles = [
    {
        selector: "node",
            style: {
            label: "data(label)",
            color: "#fff",
            width: "60px",
            height: "40px",
            shape: "roundrectangle",

            backgroundColor: "#363636",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "5px",
            "font-weight": "bold",
            //"text-margin-y": -10,

            //"text-background-color": "#fff",
            //"text-background-opacity": 1,
            //"text-background-padding": "3px",
            //"text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "node:selected",
        style: {
            "border-width": "1x",
            "border-color": "#fff",
            "border-style": "solid",
            "background-color": "#686767",
        },
    },
    {
        selector: "edge",
        style: {
            width: 1.5,
            color: "#fff",
            label: "data(similarity)",
            "line-color": "data(color)",
            "text-valign": "bottom",
            "font-weight": "bold",
            "font-size": "4px",
            "curve-style": "bezier",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "outside-to-node",
            "text-rotation": "autorotate",

            "text-background-color": "#615B5B",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "edge:selected",
        style: {
            "line-color": "#fff",
            "target-arrow-color": "#fff",
            "text-background-color": "data(color)",
        },
    }
] as any;