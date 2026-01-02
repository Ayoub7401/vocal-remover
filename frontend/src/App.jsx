import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Music, Disc, Play, Pause, Download, Wand2, X } from 'lucide-react';

function App() {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultUrl, setResultUrl] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Only accept audio
        if (file.type.startsWith('audio/')) {
            setFile(file);
            setResultUrl(null); // Reset result
        } else {
            alert("Please upload an audio file.");
        }
    };

    const processFile = async () => {
        if (!file) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Use relative path "/upload" which works on localhost (proxy) and Docker (same origin)
            const response = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setResultUrl(url);
            } else {
                console.error("Upload failed");
                alert("Failed to process audio.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error connecting to server.");
        } finally {
            setIsProcessing(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setResultUrl(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl glass-panel bg-white/5 border border-white/10">
                        <Music className="w-8 h-8 text-purple-400 mr-2" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            VocalRemover
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight title-gradient">
                        Music to Instrumentals
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] max-w-lg mx-auto">
                        Upload your favorite track and let our AI functionality isolate the instrumentals instantly.
                    </p>
                </header>

                {/* Main Card */}
                <div className="glass-panel p-8 md:p-12 relative overflow-hidden transition-all duration-300">

                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.form
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onDragEnter={handleDrag}
                                onSubmit={(e) => e.preventDefault()}
                                className="relative"
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleChange}
                                    accept="audio/*"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 group
                    ${dragActive
                                            ? "border-purple-500 bg-purple-500/10 scale-[1.02]"
                                            : "border-[var(--glass-border)] hover:border-purple-400/50 hover:bg-white/5"
                                        }`}
                                >
                                    <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <p className="text-xl font-medium mb-2">Drop your audio here</p>
                                    <p className="text-sm text-[var(--text-muted)]">or click to browse</p>
                                </label>

                                {dragActive && (
                                    <div
                                        className="absolute inset-0 w-full h-full"
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    />
                                )}
                            </motion.form>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="relative mb-6">
                                    <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg ${isProcessing ? 'animate-spin' : ''}`}>
                                        <Disc className="w-12 h-12 text-white" />
                                    </div>
                                    {isProcessing && (
                                        <div className="absolute inset-0 rounded-full border-4 border-purple-400/30 animate-pulse-glow" />
                                    )}
                                </div>

                                <h3 className="text-xl font-semibold mb-1 max-w-full truncate px-4">
                                    {file.name}
                                </h3>
                                <p className="text-sm text-[var(--text-muted)] mb-8">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>

                                {!resultUrl ? (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={clearFile}
                                            disabled={isProcessing}
                                            className="px-6 py-3 rounded-xl border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={processFile}
                                            disabled={isProcessing}
                                            className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-105 disabled:opacity-50 disabled:grayscale"
                                        >
                                            {isProcessing ? (
                                                <>Processing...</>
                                            ) : (
                                                <>
                                                    <Wand2 className="w-5 h-5" />
                                                    Remove Vocals
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                                            <audio controls className="w-full outline-none" src={resultUrl} />
                                        </div>

                                        <div className="flex gap-4 justify-center">
                                            <button
                                                onClick={clearFile}
                                                className="px-6 py-3 rounded-xl border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                Start Over
                                            </button>
                                            <a
                                                href={resultUrl}
                                                download={`instrumental_${file.name}`}
                                                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-green-600/20 transition-all hover:scale-105"
                                            >
                                                <Download className="w-5 h-5" />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default App;
