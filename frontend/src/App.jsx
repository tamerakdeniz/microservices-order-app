import { useCallback, useEffect, useState } from "react";

const PRODUCT_ENDPOINT = "/api/v1/products";
const LOGOUT_ENDPOINT = "/api/auth/logout";
const PAGE_SIZE = 8;
const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: ""
};

function getCookieValue(name) {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

function getCsrfToken() {
  const token = getCookieValue("XSRF-TOKEN");
  return token ? decodeURIComponent(token) : "";
}

function normalizeProductPage(payload) {
  if (Array.isArray(payload)) {
    return {
      content: payload,
      number: 0,
      size: payload.length,
      totalElements: payload.length,
      totalPages: payload.length > 0 ? 1 : 0
    };
  }

  return {
    content: Array.isArray(payload?.content) ? payload.content : [],
    number: Number.isInteger(payload?.number) ? payload.number : 0,
    size: Number.isInteger(payload?.size) ? payload.size : PAGE_SIZE,
    totalElements: Number.isInteger(payload?.totalElements) ? payload.totalElements : 0,
    totalPages: Number.isInteger(payload?.totalPages) ? payload.totalPages : 0
  };
}

function formatCurrency(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "-";
  }

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY"
  }).format(number);
}

function App() {
  const [productPage, setProductPage] = useState(() => normalizeProductPage([]));
  const [page, setPage] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [mutationStatus, setMutationStatus] = useState("idle");

  const loadProducts = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(`${PRODUCT_ENDPOINT}?page=${page}&size=${PAGE_SIZE}`, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Accept: "application/json"
        }
      });

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof payload === "string"
            ? payload || `Request failed with ${response.status}`
            : payload?.detail || `Request failed with ${response.status}`
        );
      }

      setProductPage(normalizeProductPage(payload));
      setStatus("success");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed");
      setStatus("error");
    }
  }, [page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const createProduct = async (event) => {
    event.preventDefault();

    const csrfToken = getCsrfToken();

    if (!csrfToken) {
      setError("CSRF token is missing. Refresh after login.");
      return;
    }

    setMutationStatus("saving");
    setError("");

    try {
      const response = await fetch(PRODUCT_ENDPOINT, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          stock: Number(form.stock)
        })
      });

      const payload = response.status === 204 ? null : await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.detail || `Create failed with ${response.status}`);
      }

      setForm(EMPTY_FORM);
      if (page === 0) {
        await loadProducts();
      } else {
        setPage(0);
      }
      setMutationStatus("idle");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Create failed");
      setMutationStatus("idle");
    }
  };

  const deleteProduct = async (id) => {
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
      setError("CSRF token is missing. Refresh after login.");
      return;
    }

    setMutationStatus(id);
    setError("");

    try {
      const response = await fetch(`${PRODUCT_ENDPOINT}/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
          "X-XSRF-TOKEN": csrfToken
        }
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.detail || `Delete failed with ${response.status}`);
      }

      if (productPage.content.length === 1 && page > 0) {
        setPage((current) => Math.max(current - 1, 0));
      } else {
        await loadProducts();
      }
      setMutationStatus("idle");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Delete failed");
      setMutationStatus("idle");
    }
  };

  const csrfToken = getCsrfToken();
  const isBusy = status === "loading" || mutationStatus === "saving";
  const canGoPrevious = productPage.number > 0;
  const canGoNext = productPage.totalPages > 0 && productPage.number + 1 < productPage.totalPages;

  return (
    <main className="shell">
      <section className="toolbar" aria-labelledby="products-title">
        <div>
          <p className="eyebrow">BFF secured catalog</p>
          <h1 id="products-title">Products</h1>
        </div>
        <div className="toolbarActions">
          <span className={`status status-${status}`}>
            {status === "loading" ? "Loading" : status === "error" ? "Error" : "Ready"}
          </span>
          <button className="button button-secondary" type="button" onClick={loadProducts} disabled={isBusy}>
            Refresh
          </button>
          <form className="logoutForm" action={LOGOUT_ENDPOINT} method="post">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <button className="button button-danger" type="submit" disabled={!csrfToken}>
              Logout
            </button>
          </form>
        </div>
      </section>

      {error ? <p className="alert">{error}</p> : null}

      <section className="contentGrid">
        <form className="panel formPanel" onSubmit={createProduct}>
          <h2>New Product</h2>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleInputChange} required maxLength="255" />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleInputChange} rows="4" />
          </label>
          <div className="fieldRow">
            <label>
              Price
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <button className="button" type="submit" disabled={!csrfToken || isBusy}>
            {mutationStatus === "saving" ? "Saving" : "Create"}
          </button>
        </form>

        <section className="panel listPanel" aria-label="Product list">
          <div className="listHeader">
            <div>
              <h2>Catalog</h2>
              <p>{productPage.totalElements} total products</p>
            </div>
            <div className="pager">
              <button
                className="iconButton"
                type="button"
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                disabled={!canGoPrevious || isBusy}
                aria-label="Previous page"
              >
                &lt;
              </button>
              <span>
                {productPage.totalPages === 0 ? "0 / 0" : `${productPage.number + 1} / ${productPage.totalPages}`}
              </span>
              <button
                className="iconButton"
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={!canGoNext || isBusy}
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          </div>

          {status === "loading" ? (
            <p className="emptyState">Loading products...</p>
          ) : productPage.content.length === 0 ? (
            <p className="emptyState">No products found.</p>
          ) : (
            <ul className="productList">
              {productPage.content.map((product) => (
                <li className="productItem" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.description || "No description"}</p>
                  </div>
                  <div className="productMeta">
                    <span>{formatCurrency(product.price)}</span>
                    <span>{product.stock} in stock</span>
                  </div>
                  <button
                    className="button button-danger"
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    disabled={mutationStatus === product.id || isBusy}
                  >
                    {mutationStatus === product.id ? "Deleting" : "Delete"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
