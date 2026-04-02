import React, { useState, useEffect } from "react";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    product: "",
    price: "",
    image: "",
    category: ""
  });

  const [savedData, setSavedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const oldData = JSON.parse(localStorage.getItem("products")) || [];
    setSavedData(oldData);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let updatedData;

    if (editIndex !== null) {
      updatedData = savedData.map((item, index) =>
        index === editIndex ? formData : item
      );
    } else {
      updatedData = [...savedData, formData];
    }

    setSavedData(updatedData);
    localStorage.setItem("products", JSON.stringify(updatedData));

    setFormData({
      product: "",
      price: "",
      image: "",
      category: ""
    });

    setEditIndex(null);
  }

  function Delete(index) {
    const updatedData = savedData.filter((_, i) => i !== index);
    setSavedData(updatedData);
    localStorage.setItem("products", JSON.stringify(updatedData));
  }

  function Edit(index) {
    const selectedData = savedData[index];
    setFormData(selectedData);
    setEditIndex(index);
  }

  return (
    <div className="container mt-5 border border-1">

      {/* FORM */}
      <div className="card p-4 border-0 bg-body-tertiary">
        <h2 className="mb-4">-: Product Form :-</h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Product Name</label>
            <input type="text" name="product" className="form-control"
              value={formData.product} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label>Price</label>
            <input type="number" name="price" className="form-control"
              value={formData.price} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label>Image URL</label>
            <input type="text" name="image" className="form-control"
              value={formData.image} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label>Category</label>
            <select name="category" className="form-select"
              value={formData.category} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            {editIndex !== null ? "Update" : "Save"}
          </button>
        </form>
      </div>

      {/* SEARCH + SORT */}
      <div className="mx-auto mt-4 bg-white w-75 text-center">

        <input
          type="text"
          placeholder="Search product..."
          className="form-control w-50 mx-auto mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select w-25 mx-auto mb-3"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
          <option value="priceLow">Price:Low to high</option>
          <option value="priceHigh">Price:High to Low</option>
        </select>

        {/* TABLE */}
        <table className="table mx-auto">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Image</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {savedData
              .filter((item) =>
                item.product.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a, b) => {
                if (sortOrder === "az") {
                  return a.product.localeCompare(b.product);
                } else if (sortOrder === "za") {
                  return b.product.localeCompare(a.product);
                }
                 else if (sortOrder === "priceLow") {
    return Number(a.price) - Number(b.price);
  } 
  else if (sortOrder === "priceHigh") {
    return Number(b.price) - Number(a.price);
  }
                return 0;
              })
              .map((item, index) => (
                <tr key={index}>

                  <td>{item.product}</td>
                  <td>₹{item.price}</td>

                  <td>
                    <img src={item.image} alt="" width="50" height="50" />
                  </td>

                  <td>{item.category}</td>

                  <td>
                    <button className="btn btn-outline-danger me-2"
                      onClick={() => Delete(index)}>Delete</button>

                    <button className="btn btn-outline-success"
                      onClick={() => Edit(index)}>Edit</button>
                  </td>

                </tr>
              ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}