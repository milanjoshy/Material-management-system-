import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Dashboard({ setIsLoggedIn, user, setUser }) {
    const [materials, setMaterials] = useState([]);
    const [material, setMaterial] = useState({ materialName: "", category: "", quantity: "" });
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.email) {
            fetchMaterials(user.email); // Passing email for filtering
        }
    }, [user]);

    const fetchMaterials = async (userEmail) => {
        try {
            const response = await axios.get("http://localhost:8000/viewMaterials", {
                params: { email: userEmail },  // Using query parameters to pass the email
            });
            console.log("Fetched materials:", response.data);
            setMaterials(response.data);
        } catch (error) {
            console.error("Error fetching materials:", error);
            toast.error("Failed to fetch materials");
        }
    };

    const handleChange = (e) => {
        setMaterial({ ...material, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!user || !user.email) {
            toast.error("User not authenticated. Please log in again.");
            setIsLoggedIn(false);
            navigate('/');
            return;
        }

        const { materialName, category, quantity } = material;
        if (!materialName.trim() || !category.trim() || !quantity.trim()) {
            toast.error("All fields are required and cannot be empty!");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = { ...material, createdBy: user.email };
            console.log("Submitting payload:", payload);
            if (editId) {
                await axios.put(`http://localhost:8000/editMaterial/${editId}`, payload);
                toast.success("Material Updated Successfully");
            } else {
                await axios.post("http://localhost:8000/addMaterial", payload);
                toast.success("Material Added Successfully");
            }
            setMaterial({ materialName: "", category: "", quantity: "" });
            setEditId(null);
            await fetchMaterials(user.email); // Fetch materials after submit
        } catch (error) {
            console.error("Error submitting material:", error);
            toast.error(error.response?.data?.error || error.message || "Failed to add material");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (material) => {
        setMaterial({
            materialName: material.materialName,
            category: material.category,
            quantity: material.quantity
        });
        setEditId(material._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this material?")) {
            try {
                await axios.delete(`http://localhost:8000/deleteMaterial/${id}`);
                toast.success("Material Deleted Successfully");
                await fetchMaterials(user.email); // Fetch materials after deletion
            } catch (error) {
                console.error("Error deleting material:", error);
                toast.error("Failed to delete material");
            }
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Material Inventory for {user?.name}</h1>
                <div className="action-buttons">
                    <Link
                        to="#"
                        onClick={() => {
                            setMaterial({ materialName: "", category: "", quantity: "" });
                            setEditId(null);
                        }}
                        className="text-blue-500 hover:underline"
                    >
                        Add New Material →
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input
                        name="materialName"
                        placeholder="Material Name"
                        value={material.materialName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="category"
                        placeholder="Category"
                        value={material.category}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="quantity"
                        placeholder="Quantity"
                        type="number"
                        value={material.quantity}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : editId ? "Update Material" : "Add Material"}
                    </button>
                </form>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sl.No</th>
                            <th>Material Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((m, index) => (
                            <tr key={m._id}>
                                <td>{index + 1}</td>
                                <td>{m.materialName}</td>
                                <td>{m.category}</td>
                                <td>{m.quantity}</td>
                                <td className="action-icons">
                                    <button onClick={() => handleEdit(m)} className="edit">
                                        <FaEdit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(m._id)} className="delete">
                                        <FaTrash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ToastContainer position="top-left" autoClose={3000} hideProgressBar closeOnClick />
        </div>
    );
}

export default Dashboard;
