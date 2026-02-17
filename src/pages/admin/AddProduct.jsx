import { useState } from "react";
import axios from "axios";

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    
    // Exact payload structure matches your Postman test
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stockQuantity: "",
        categoryId: "2", // Defaulting to 2 for now
        categoryName: "RC Hobbies",
        description: "",
        imageUrl: "https://placehold.co/600x400/c0392b/white?text=New+Product", 
        skuCode: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Using the URL from your Postman screenshot
            const response = await axios.post("http://127.0.0.1:7082/products/products/create", {
                ...formData,
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity)
            });

            if (response.status === 201 || response.status === 200) {
                alert("✅ Product Created & Inventory Stocked!");
                setFormData({ ...formData, name: "", skuCode: "", price: "", stockQuantity: "" });
            }
        } catch (error) {
            console.error("Error creating product:", error);
            alert("❌ Failed to create product. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Add New Product</h1>
                    <p className="text-slate-400 mt-2">Create a product and automatically initialize inventory.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: The Form */}
                <div className="lg:col-span-2">
                    <div className="bg-[#161b2c] backdrop-blur-xl p-8 rounded-3xl border border-slate-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Row 1 */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
                                    <input 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all" 
                                        placeholder="e.g. NitroX RC Car"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SKU Code</label>
                                    <input 
                                        name="skuCode" 
                                        value={formData.skuCode} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-blue-500 transition-all" 
                                        placeholder="RC-BUG-XXX"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price ($)</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        value={formData.price} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all" 
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Initial Stock</label>
                                    <input 
                                        type="number" 
                                        name="stockQuantity" 
                                        value={formData.stockQuantity} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-green-500 transition-all" 
                                        placeholder="e.g. 50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all resize-none" 
                                    placeholder="Product details..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-[0.98]"
                            >
                                {loading ? "Creating..." : "Create Product"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Preview Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-1">Live Preview</h3>
                        
                        {/* The Product Card Preview */}
                        <div className="bg-[#161b2c] p-4 rounded-2xl shadow-xl border border-slate-700">
                            <div className="aspect-[4/3] bg-slate-800 rounded-xl mb-4 overflow-hidden relative">
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/10">
                                    {formData.skuCode || "NO-SKU"}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-white text-lg leading-tight">
                                    {formData.name || "Product Name"}
                                </h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-400 font-bold text-xl">
                                        ${formData.price || "0.00"}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${formData.stockQuantity > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                                        {formData.stockQuantity > 0 ? `${formData.stockQuantity} in stock` : "Out of Stock"}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-xs line-clamp-2 mt-2">
                                    {formData.description || "Product description will appear here..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AddProduct;