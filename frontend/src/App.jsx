import { useCallback, useEffect, useState } from "react";

const PRODUCT_ENDPOINT = "/api/v1/products";

function App() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const loadProduct = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(PRODUCT_ENDPOINT, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Accept: "text/plain"
        }
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || `Request failed with ${response.status}`);
      }

      setResult(text);
      setStatus("success");
    } catch (requestError) {
      setResult("");
      setError(requestError instanceof Error ? requestError.message : "Request failed");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return (
    <main className="shell">
      <section className="panel" aria-labelledby="products-title">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">BFF</p>
            <h1 id="products-title">Products</h1>
          </div>
          <span className={`status status-${status}`}>
            {status === "loading" ? "Loading" : status === "error" ? "Error" : "Ready"}
          </span>
        </div>

        <div className="responseBox">
          <span className="label">GET {PRODUCT_ENDPOINT}</span>
          <strong>{result || error || "..."}</strong>
        </div>

        <button className="button" type="button" onClick={loadProduct} disabled={status === "loading"}>
          Refresh
        </button>
      </section>
    </main>
  );
}

export default App;

