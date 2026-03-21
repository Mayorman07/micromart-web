import { useState } from "react";
import * as XLSX from "xlsx"; 
import api from "../../services/api"; 

/**
 * Static Category Mapping
 * Used to synchronize UI display names with backend database identifiers.
 */
const categoryMap = [
    { id: 3, name: "RC Hobbies" },
    { id: 3, name: "Drones" },
    { id: 1, name: "Eyewear" },
    { id: 4, name: "Anime Collectibles" },
    { id: 5, name: "Pokemon" },
    { id: 6, name: "Pens" },
    { id: 7, name: "Sound" }
];

/**
 * AddProduct Component
 * Orchestrates product registration through manual entry or bulk Excel importation.
 * Leverages the centralized api service for secure cross-origin requests.
 */
const AddProduct = () => {
    const [view, setView] = useState("manual"); 
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [showSummary, setShowSummary] = useState(false);
    const [importSummary, setImportSummary] = useState({ success: 0, failures: [] });

    const [formData, setFormData] = useState({
        name: "", 
        price: "", 
        stockQuantity: "", 
        categoryId: 3, 
        categoryName: "RC Hobbies", 
        description: "", 
        imageUrl: "", 
        skuCode: ""
    });

    /**
     * Downloads a standardized Excel template for bulk uploads.
     */
    const downloadTemplate = () => {
        const headers = [["name", "price", "stockQuantity", "categoryId", "categoryName", "description", "imageUrl", "skuCode"]];
        const ws = XLSX.utils.aoa_to_sheet(headers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "Product_Import_Template.xlsx");
    };

    /**
     * Handles bulk import via Excel.
     * Cleans data keys and ensures numeric types match backend DTO requirements.
     */
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        setLoading(true);

        reader.onload = async (evt) => {
            const wb = XLSX.read(evt.target.result, { type: "binary" });
            const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            setProgress({ current: 0, total: data.length });
            
            let successCount = 0;
            let failureLog = [];

            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                /** * Normalizing keys to lowercase to prevent '400 Bad Request' errors 
                 * caused by casing mismatches in Excel headers. 
                 */
                const normalizedRow = Object.keys(row).reduce((acc, key) => {
                    acc[key.toLowerCase()] = row[key];
                    return acc;
                }, {});

                try {
                    // Headers are handled automatically by the api.interceptors
                    await api.post("/products/products/create", {
                        ...normalizedRow,
                        price: parseFloat(normalizedRow.price) || 0,
                        stockQuantity: parseInt(normalizedRow.stockquantity || normalizedRow.stockquantity) || 0,
                        categoryId: parseInt(normalizedRow.categoryid) || 3 
                    });
                    successCount++;
                } catch (err) {
                    failureLog.push({ 
                        sku: normalizedRow.skucode || "Unknown Identifier", 
                        reason: err.response?.data?.message || "Internal Service Error" 
                    });
                }
                setProgress(prev => ({ ...prev, current: i + 1 }));
            }
            setImportSummary({ success: successCount, failures: failureLog });
            setLoading(false);
            setShowSummary(true);
        };
        reader.readAsBinaryString(file);
    };

    /**
     * Submits a single product registration manually.
     * Synchronizes form data with the Product and Inventory microservices.
     */
    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            stockQuantity: parseInt(formData.stockQuantity) || 0,
            categoryId: parseInt(formData.categoryId)
        };

        try {
            // Authentication and Content-Type are handled by the centralized api instance
            await api.post("/products/products/create", payload);
            alert("Product created successfully.");
            setFormData({ name: "", price: "", stockQuantity: "", categoryId: 3, categoryName: "RC Hobbies", description: "", imageUrl: "", skuCode: "" });
        } catch (err) {
            console.error("Submission Error:", err.response?.data);
            alert(`Error ${err.response?.status}: ${err.response?.data?.message || "Failed to create product"}`);
        } finally { 
            setLoading(false); 
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "categoryName") {
            const selected = categoryMap.find(cat => cat.name === value);
            setFormData({
                ...formData,
                categoryName: value,
                categoryId: selected ? selected.id : 3
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const inputStyle = "w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all";

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center bg-[#161b2c] p-4 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex gap-2">
                    <button onClick={() => setView("manual")} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${view === 'manual' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>MANUAL ENTRY</button>
                    <button onClick={() => setView("bulk")} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${view === 'bulk' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>BULK IMPORT</button>
                </div>
                {view === "bulk" && (
                    <button onClick={downloadTemplate} className="text-[10px] font-black text-cyan-500 hover:text-cyan-400 flex items-center gap-2 px-4 transition-all">DOWNLOAD TEMPLATE</button>
                )}
            </div>

            {loading && view === "bulk" && (
                <div className="bg-[#161b2c] border border-emerald-500/20 p-6 rounded-3xl animate-in slide-in-from-top-4">
                    <div className="flex justify-between text-[10px] font-black mb-3 text-emerald-500 uppercase">
                        <span>Synchronizing Database...</span>
                        <span>{progress.current} / {progress.total}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(progress.current / progress.total) * 100}%` }}></div>
                    </div>
                </div>
            )}

            {view === "manual" ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                    <div className="lg:col-span-2 bg-[#161b2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <form onSubmit={handleManualSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <input name="name" value={formData.name} onChange={handleChange} className={inputStyle} placeholder="Product Name" required />
                                <input name="skuCode" value={formData.skuCode} onChange={handleChange} className={`${inputStyle} font-mono uppercase`} placeholder="SKU Code" required />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className={inputStyle} placeholder="Price ($)" required />
                                <input name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} className={inputStyle} placeholder="Initial Stock" required />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <select name="categoryName" value={formData.categoryName} onChange={handleChange} className={`${inputStyle} appearance-none`}>
                                    {categoryMap.map(cat => (
                                        <option key={`${cat.id}-${cat.name}`} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputStyle} placeholder="Image URL" />
                            </div>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className={`${inputStyle} resize-none`} placeholder="Product Description..."></textarea>
                            <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-[10px] text-white tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all">
                                {loading ? "PROCESSING..." : "REGISTER PRODUCT"}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-[#161b2c] p-4 rounded-[2.5rem] border border-white/5 shadow-2xl sticky top-8">
                            <div className="aspect-[4/3] bg-slate-800 rounded-3xl mb-4 overflow-hidden relative">
                                <img src={formData.imageUrl || "https://placehold.co/600x400/2c3e50/white?text=No+Image"} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-white">{formData.skuCode || "NO-SKU"}</div>
                            </div>
                            <div className="space-y-3 px-2">
                                <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{formData.categoryName} (ID: {formData.categoryId})</p>
                                <h4 className="font-bold text-white text-xl leading-tight">{formData.name || "Product Name"}</h4>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-white font-black text-2xl">${formData.price || "0.00"}</span>
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-black ${formData.stockQuantity > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>{formData.stockQuantity || 0} UNITS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-[#161b2c] border-2 border-dashed border-white/10 rounded-[3rem] animate-in zoom-in-95 duration-500">
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Bulk Product Import</h2>
                        <label className={`inline-block cursor-pointer bg-emerald-600 px-12 py-4 rounded-2xl font-black text-[10px] text-white tracking-widest hover:bg-emerald-700 transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                            {loading ? "PROCESSING..." : "SELECT DATA FILE"}
                            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>
                </div>
            )}

            {showSummary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#161b2c] border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl text-center">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Import Summary</h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                                <p className="text-emerald-500 text-3xl font-black">{importSummary.success}</p>
                                <p className="text-[9px] font-black text-emerald-500/60 uppercase">Successful</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                <p className="text-red-500 text-3xl font-black">{importSummary.failures.length}</p>
                                <p className="text-[9px] font-black text-red-500/60 uppercase">Errors</p>
                            </div>
                        </div>
                        <button onClick={() => setShowSummary(false)} className="w-full py-4 bg-white text-[#161b2c] font-black text-[10px] tracking-widest rounded-2xl hover:bg-slate-200 uppercase">Close Report</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProduct;