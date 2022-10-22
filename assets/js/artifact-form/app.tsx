import React from "react";
import { createRoot } from "react-dom/client";

function Example() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

const root = createRoot(document.getElementById("artifact-form"));
root.render(React.createElement(Example));
