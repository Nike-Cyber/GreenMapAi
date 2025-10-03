
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Report, ReportType } from './types';

// --- ICONS (as React Components) ---

const TreeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 012 0v5.012a2.5 2.5 0 011.237 1.237l.001.002a2.5 2.5 0 11-4.476 0L9 9.012V4z" />
    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
  </svg>
);

const PollutionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const ReportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const NewsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3H9m-4 0H5m14 0v2m-3-2v4m-3-4v4" /></svg>
);
const AnalysisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
);
const ChatbotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

// --- MOCK DATA & HELPERS ---

const initialReports: Report[] = [
    { id: '1', type: ReportType.TreePlantation, latitude: 51.505, longitude: -0.09, locationName: "Central Park London", description: "Planted 50 oak trees.", reportedBy: "Eco Warriors", timestamp: "2024-05-20T10:00:00Z" },
    { id: '2', type: ReportType.PollutionHotspot, latitude: 51.51, longitude: -0.1, locationName: "River Thames Bank", description: "Large amount of plastic waste.", reportedBy: "GreenPeace", timestamp: "2024-05-18T14:30:00Z" },
    { id: '3', type: ReportType.TreePlantation, latitude: 51.52, longitude: -0.12, locationName: "Regent's Park", description: "Community planting event.", reportedBy: "Alex Green", timestamp: "2024-05-21T11:00:00Z" },
    { id: '4', type: ReportType.TreePlantation, latitude: 51.49, longitude: -0.11, locationName: "Hyde Park Corner", description: "Planted cherry blossom trees.", reportedBy: "Alex Green", timestamp: "2024-04-15T09:00:00Z" },
    { id: '5', type: ReportType.PollutionHotspot, latitude: 51.515, longitude: -0.08, locationName: "City Alleyway", description: "Overflowing bins and litter.", reportedBy: "GreenPeace", timestamp: "2024-04-25T18:00:00Z" },
    { id: '6', type: ReportType.TreePlantation, latitude: 51.50, longitude: -0.13, locationName: "Soho Square Gardens", description: "Added new flower beds and 5 trees.", reportedBy: "Eco Warriors", timestamp: "2024-03-10T12:00:00Z" },
];

const mockNewsData = [
    { id: 1, title: "Global Reforestation Efforts Reach New Heights", excerpt: "A new report shows a 15% increase in worldwide tree planting initiatives over the past year.", date: "2024-05-20", imageUrl: "https://picsum.photos/seed/news1/400/200" },
    { id: 2, title: "Innovative Technology Turns Plastic Waste Into Fuel", excerpt: "Startups are developing new methods to tackle the plastic pollution crisis in our oceans.", date: "2024-05-18", imageUrl: "https://picsum.photos/seed/news2/400/200" },
    { id: 3, title: "Community Gardens Transform Urban Landscapes", excerpt: "Cities are embracing green spaces, with community-led projects improving air quality and biodiversity.", date: "2024-05-15", imageUrl: "https://picsum.photos/seed/news3/400/200" },
];

const createLeafletIcon = (color: string) => {
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 2rem;
        height: 2rem;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid #fff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      ">
        <div style="transform: rotate(45deg); color: white;">
          ${color === '#4CAF50' ? '🌳' : '⚠️'}
        </div>
      </div>
    `;
    return new L.DivIcon({
        html: iconHtml,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

const treeMarkerIcon = createLeafletIcon('#4CAF50');
const pollutionMarkerIcon = createLeafletIcon('#F44336');

// --- APP LAYOUT COMPONENTS ---

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const navItemClasses = "flex items-center px-4 py-3 text-lg font-medium rounded-md transition-all duration-300 w-full";
    const activeClasses = "bg-emerald-500 text-white shadow-lg";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <aside className="w-64 bg-gray-800/80 backdrop-blur-sm text-white flex flex-col z-30 shadow-2xl">
            <div className="p-4 border-b border-gray-700">
                <Link to="/dashboard" className="text-3xl font-bold text-emerald-400 flex items-center justify-center">
                    <span className="text-4xl mr-2">🌍</span>GreenMap
                </Link>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/dashboard" className={({ isActive }) => `${navItemClasses} ${isActive ? activeClasses : inactiveClasses}`}><DashboardIcon />Dashboard</NavLink>
                <NavLink to="/reports" className={({ isActive }) => `${navItemClasses} ${isActive ? activeClasses : inactiveClasses}`}><ReportIcon />Reports</NavLink>
                <NavLink to="/analysis" className={({ isActive }) => `${navItemClasses} ${isActive ? activeClasses : inactiveClasses}`}><AnalysisIcon />Analysis</NavLink>
                <NavLink to="/news" className={({ isActive }) => `${navItemClasses} ${isActive ? activeClasses : inactiveClasses}`}><NewsIcon />News</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `${navItemClasses} ${isActive ? activeClasses : inactiveClasses}`}><UserIcon />Profile</NavLink>
                <NavLink to="/about" className={({ isActive }) => `${navItemClasses} ${isActive ? activeClasses : inactiveClasses}`}><InfoIcon />About</NavLink>
            </nav>
            <div className="p-4 border-t border-gray-700">
                <div className="flex justify-center space-x-4 mb-4">
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">LinkedIn</a>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Twitter</a>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Instagram</a>
                </div>
                <button onClick={onLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    Logout
                </button>
            </div>
        </aside>
    );
};

// --- REPORT FORM COMPONENT ---

interface ReportFormProps {
    position?: { lat: number; lng: number };
    reportToEdit?: Report;
    onClose: () => void;
    onSubmit?: (report: Omit<Report, 'id' | 'reportedBy' | 'timestamp'>) => void;
    onUpdate?: (report: Report) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ position, reportToEdit, onClose, onSubmit, onUpdate }) => {
    const isEditMode = !!reportToEdit;
    const [locationName, setLocationName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<ReportType>(ReportType.TreePlantation);

    useEffect(() => {
        if (isEditMode && reportToEdit) {
            setLocationName(reportToEdit.locationName);
            setDescription(reportToEdit.description);
            setType(reportToEdit.type);
        }
    }, [reportToEdit, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && onUpdate && reportToEdit) {
            onUpdate({
                ...reportToEdit,
                locationName,
                description,
                type,
            });
        } else if (onSubmit && position) {
            onSubmit({
                type,
                latitude: position.lat,
                longitude: position.lng,
                locationName,
                description,
            });
        }
    };

    const currentLat = isEditMode ? reportToEdit.latitude : position?.lat ?? 0;
    const currentLng = isEditMode ? reportToEdit.longitude : position?.lng ?? 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div className="bg-gray-800 text-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-emerald-400">{isEditMode ? 'Edit Report' : 'Report an Event'}</h2>
                <form onSubmit={handleSubmit}>
                     <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2">Location Name</label>
                        <input type="text" value={locationName} onChange={e => setLocationName(e.target.value)} required className="w-full bg-gray-700 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-gray-700 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2">Report Type</label>
                        <select value={type} onChange={e => setType(e.target.value as ReportType)} className="w-full bg-gray-700 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value={ReportType.TreePlantation}>🌱 Tree Plantation</option>
                            <option value={ReportType.PollutionHotspot}>⚠️ Pollution Hotspot</option>
                        </select>
                    </div>
                     <div className="mb-6">
                        <label className="block text-gray-400 text-sm font-bold mb-2">Coordinates</label>
                         <p className="text-sm font-mono bg-gray-900 p-2 rounded">{currentLat.toFixed(5)}, {currentLng.toFixed(5)}</p>
                         {isEditMode && <p className="text-xs text-gray-500 mt-1">Drag the marker on the map to change location.</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">{isEditMode ? 'Update Report' : 'Submit Report'}</button>
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-300">Cancel</button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

// --- MAP COMPONENT ---

interface MapComponentProps {
    reports: Report[];
    onMapClick: (latlng: L.LatLng) => void;
    onViewDetails: (report: Report) => void;
    onEditReport: (report: Report) => void;
    editingReportId: string | null;
    onMarkerDragEnd: (reportId: string, newLatLng: L.LatLng) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ reports, onMapClick, onViewDetails, onEditReport, editingReportId, onMarkerDragEnd }) => {
    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => onMapClick(e.latlng),
        });
        return null;
    };

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <MapClickHandler />
            {reports.map(report => (
                <Marker
                    key={report.id}
                    position={[report.latitude, report.longitude]}
                    icon={report.type === ReportType.TreePlantation ? treeMarkerIcon : pollutionMarkerIcon}
                    draggable={report.id === editingReportId}
                    eventHandlers={{
                        dragend: (e) => {
                            onMarkerDragEnd(report.id, e.target.getLatLng());
                        },
                    }}
                >
                    {report.id === editingReportId && (
                        <Tooltip permanent direction="top" offset={[0, -32]}>
                           Editing... Drag me!
                        </Tooltip>
                    )}
                    <Popup>
                        <div className="text-gray-800 w-48">
                            <h3 className="font-bold text-base mb-1">{report.locationName}</h3>
                            <p className="text-xs text-gray-500 mb-2">By {report.reportedBy}</p>
                            <div className="flex space-x-2 mt-2">
                                <button onClick={() => onViewDetails(report)} className="flex-1 text-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded-md transition-colors">Details</button>
                                <button onClick={() => onEditReport(report)} className="flex-1 text-xs bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-2 rounded-md transition-colors">Edit</button>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};


// --- CHATBOT COMPONENT ---

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Hello! I'm EcoBot. How can I help you with GreenMap today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;

        const userMessage: ChatMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        setTimeout(() => {
            const botResponse: ChatMessage = { id: Date.now() + 1, text: getBotResponse(inputValue), sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const getBotResponse = (userInput: string): string => {
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes('tree') || lowerInput.includes('plantation')) {
            return "To report a tree plantation, simply go to the dashboard and click on the map where the trees were planted. A form will appear for you to fill out the details!";
        }
        if (lowerInput.includes('pollution') || lowerInput.includes('hotspot')) {
            return "Reporting a pollution hotspot is easy. Click on the location on the main map, fill in the description, select 'Pollution Hotspot', and submit.";
        }
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hi there! What can I help you with?";
        }
        return "I'm not sure how to answer that. You can ask me about reporting tree plantations or pollution hotspots.";
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-40">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-emerald-500 rounded-full p-4 shadow-lg"
                    aria-label="Open Chatbot"
                >
                    <ChatbotIcon />
                </motion.button>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed bottom-24 right-6 w-80 h-96 bg-gray-800 rounded-xl shadow-2xl flex flex-col z-40"
                    >
                        <header className="bg-gray-900 p-3 flex justify-between items-center rounded-t-xl">
                            <h3 className="text-white font-bold">EcoBot</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <CloseIcon />
                            </button>
                        </header>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                    <div className={`max-w-3/4 p-2 rounded-lg text-white ${msg.sender === 'user' ? 'bg-emerald-600' : 'bg-gray-600'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                             <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Ask something..."
                                className="w-full bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
};


// --- PAGES ---

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/1920/1080?blur=5&grayscale')", filter: 'opacity(0.2)'}}></div>
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative bg-gray-800 bg-opacity-70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-white text-center w-full max-w-sm"
        >
            <h1 className="text-5xl font-bold text-emerald-400 mb-2">GreenMap</h1>
            <p className="text-gray-300 mb-8">Mapping a sustainable future, together.</p>
            <div className="space-y-4">
                <input type="email" placeholder="Email" defaultValue="demo@greenmap.com" className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="password" placeholder="Password" defaultValue="password" className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button onClick={onLogin} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 mt-8 rounded-lg transition-transform duration-300 hover:scale-105">
                Login
            </button>
        </motion.div>
    </div>
);

const WelcomeScreen: React.FC<{ username: string }> = ({ username }) => (
    <motion.div
        key="welcome-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-md flex justify-center items-center z-50"
    >
        <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0, transition: { delay: 0.2, type: 'spring', stiffness: 120 } }}
        >
            <h1 className="text-5xl font-bold text-white">Welcome, <span className="text-emerald-400">{username}</span>!</h1>
        </motion.div>
    </motion.div>
);

const ReportDetailPanel: React.FC<{ report: Report | null; onClose: () => void }> = ({ report, onClose }) => {
    return (
        <AnimatePresence>
            {report && (
                 <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-full w-96 bg-gray-800 shadow-2xl z-40 flex flex-col"
                >
                    <div className="p-6 bg-gray-900/50 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-emerald-400">Report Details</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                    </div>
                    <div className="p-6 flex-1 text-white overflow-y-auto">
                        <div className="mb-4">
                            <h3 className="font-bold text-xl">{report.locationName}</h3>
                            <p className={`text-sm font-semibold ${report.type === ReportType.TreePlantation ? 'text-green-400' : 'text-red-400'}`}>
                                {report.type === ReportType.TreePlantation ? '🌱 Tree Plantation' : '⚠️ Pollution Hotspot'}
                            </p>
                        </div>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <label className="font-bold text-gray-500 text-xs uppercase">Description</label>
                                <p>{report.description}</p>
                            </div>
                            <div>
                                <label className="font-bold text-gray-500 text-xs uppercase">Coordinates</label>
                                <p className="font-mono text-sm">{report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</p>
                            </div>
                            <div>
                                <label className="font-bold text-gray-500 text-xs uppercase">Reported By</label>
                                <p>{report.reportedBy}</p>
                            </div>
                            <div>
                                <label className="font-bold text-gray-500 text-xs uppercase">Date</label>
                                <p>{new Date(report.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                 </motion.div>
            )}
        </AnimatePresence>
    )
};


const DashboardPage: React.FC<{
    reports: Report[],
    addReport: (reportData: Omit<Report, 'id' | 'reportedBy' | 'timestamp'>) => void,
    updateReport: (reportData: Report) => void,
}> = ({ reports, addReport, updateReport }) => {
    const [formPosition, setFormPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [editingReport, setEditingReport] = useState<Report | null>(null);
    const [viewingReport, setViewingReport] = useState<Report | null>(null);

    const treeCount = useMemo(() => reports.filter(r => r.type === ReportType.TreePlantation).length, [reports]);
    const pollutionCount = useMemo(() => reports.filter(r => r.type === ReportType.PollutionHotspot).length, [reports]);

    const handleMapClick = useCallback((latlng: L.LatLng) => {
        if (!editingReport) { // Prevent opening a new form while editing
            setFormPosition({ lat: latlng.lat, lng: latlng.lng });
        }
    }, [editingReport]);

    const handleFormSubmit = (reportData: Omit<Report, 'id'| 'reportedBy' | 'timestamp'>) => {
        addReport(reportData);
        setFormPosition(null);
    };
    
    const handleUpdateSubmit = (reportData: Report) => {
        updateReport(reportData);
        setEditingReport(null);
    };

    const handleMarkerDragEnd = (reportId: string, newLatLng: L.LatLng) => {
        if (editingReport && editingReport.id === reportId) {
            setEditingReport({
                ...editingReport,
                latitude: newLatLng.lat,
                longitude: newLatLng.lng,
            });
        }
    };

    return (
        <div className="h-full w-full relative">
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-3">
                 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-4 rounded-lg shadow-lg text-white w-64">
                    <h3 className="font-bold text-lg text-emerald-400">Statistics</h3>
                    <p className="text-lg">🌱 Trees Planted: <span className="font-bold">{treeCount}</span></p>
                    <p className="text-lg">⚠️ Pollution Hotspots: <span className="font-bold">{pollutionCount}</span></p>
                </motion.div>
                 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-4 rounded-lg shadow-lg text-white w-64">
                    <h3 className="font-bold text-lg text-emerald-400">How to help?</h3>
                    <p className="text-sm">Click anywhere on the map to add a new report. Click a marker for more options.</p>
                </motion.div>
            </div>
            <MapComponent 
                reports={reports} 
                onMapClick={handleMapClick} 
                onViewDetails={setViewingReport}
                onEditReport={setEditingReport}
                editingReportId={editingReport?.id || null}
                onMarkerDragEnd={handleMarkerDragEnd}
            />
            <AnimatePresence>
                {formPosition && <ReportForm position={formPosition} onClose={() => setFormPosition(null)} onSubmit={handleFormSubmit} />}
                {editingReport && <ReportForm reportToEdit={editingReport} onClose={() => setEditingReport(null)} onUpdate={handleUpdateSubmit} />}
            </AnimatePresence>
            <ReportDetailPanel report={viewingReport} onClose={() => setViewingReport(null)} />
        </div>
    );
};

const PageContainer: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="text-white p-8"
    >
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-emerald-400 mb-8">{title}</h1>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-lg">
                {children}
            </div>
        </div>
    </motion.div>
);

const ReportsPage: React.FC<{reports: Report[]}> = ({ reports }) => {
    const [filterType, setFilterType] = useState<ReportType | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

    const filteredAndSortedReports = useMemo(() => {
        let result = [...reports];
        
        if (filterType !== 'ALL') {
            result = result.filter(r => r.type === filterType);
        }

        switch (sortBy) {
            case 'oldest':
                result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                break;
            case 'name':
                result.sort((a, b) => a.locationName.localeCompare(b.locationName));
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                break;
        }
        return result;
    }, [reports, filterType, sortBy]);

    const selectClasses = "bg-gray-700 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500";

    return (
        <PageContainer title="All Reports">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-gray-700/30 rounded-lg space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                    <label htmlFor="filter-type" className="text-gray-400">Filter by:</label>
                    <select id="filter-type" value={filterType} onChange={e => setFilterType(e.target.value as ReportType | 'ALL')} className={selectClasses}>
                        <option value="ALL">All Types</option>
                        <option value={ReportType.TreePlantation}>🌱 Tree Plantation</option>
                        <option value={ReportType.PollutionHotspot}>⚠️ Pollution Hotspot</option>
                    </select>
                </div>
                 <div className="flex items-center space-x-2">
                    <label htmlFor="sort-by" className="text-gray-400">Sort by:</label>
                    <select id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')} className={selectClasses}>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Location Name (A-Z)</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                        <tr className="border-b border-gray-600">
                            <th className="p-3">Type</th>
                            <th className="p-3">Location Name</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedReports.map(report => (
                            <tr key={report.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <td className="p-3">{report.type === ReportType.TreePlantation ? '🌱 Plantation' : '⚠️ Pollution'}</td>
                                <td className="p-3">{report.locationName}</td>
                                <td className="p-3">{report.description}</td>
                                <td className="p-3">{new Date(report.timestamp).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageContainer>
    );
};

const AnalysisPage: React.FC<{ reports: Report[] }> = ({ reports }) => {
    const analysisData = useMemo(() => {
        const totalReports = reports.length;
        if (totalReports === 0) {
            return {
                totalReports: 0,
                treeCount: 0,
                pollutionCount: 0,
                treePercentage: 0,
                pollutionPercentage: 0,
                monthlyData: [],
                maxMonthlyCount: 0,
            };
        }

        const treeCount = reports.filter(r => r.type === ReportType.TreePlantation).length;
        const pollutionCount = totalReports - treeCount;
        const treePercentage = (treeCount / totalReports) * 100;
        const pollutionPercentage = 100 - treePercentage;

        const reportsByMonth = reports.reduce<Record<string, number>>((acc, report) => {
            const date = new Date(report.timestamp);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});

        const monthlyData = Object.entries(reportsByMonth)
            .map(([dateKey, value]) => ({
                date: new Date(dateKey + '-01'), // Use first day of month for sorting
                label: new Date(dateKey + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
                value,
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime());
        
        const maxMonthlyCount = Math.max(...monthlyData.map(d => d.value), 0);

        return { totalReports, treeCount, pollutionCount, treePercentage, pollutionPercentage, monthlyData, maxMonthlyCount };
    }, [reports]);
    
    const StatCard = ({ title, value, icon, delay = 0 }) => (
        <motion.div 
            className="bg-gray-700/50 p-6 rounded-lg shadow-lg flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.15 }}
        >
            <div className="text-3xl text-emerald-400">{icon}</div>
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </motion.div>
    );

    return (
        <PageContainer title="Data Analysis">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Reports" value={analysisData.totalReports} icon="📈" delay={0} />
                <StatCard title="Tree Plantations" value={analysisData.treeCount} icon="🌳" delay={1} />
                <StatCard title="Pollution Hotspots" value={analysisData.pollutionCount} icon="⚠️" delay={2} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <motion.div 
                    className="bg-gray-700/50 p-6 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl font-bold mb-4 text-emerald-400">Report Type Distribution</h2>
                    <div className="w-full bg-gray-600 rounded-full h-8 flex overflow-hidden">
                        <motion.div
                            className="bg-green-500 flex justify-center items-center text-white font-bold"
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisData.treePercentage}%` }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                            title={`Tree Plantations: ${analysisData.treePercentage.toFixed(1)}%`}
                        >
                           {analysisData.treePercentage > 10 && `🌳 ${analysisData.treePercentage.toFixed(0)}%`}
                        </motion.div>
                         <motion.div
                            className="bg-red-500 flex justify-center items-center text-white font-bold"
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisData.pollutionPercentage}%` }}
                            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                            title={`Pollution Hotspots: ${analysisData.pollutionPercentage.toFixed(1)}%`}
                        >
                            {analysisData.pollutionPercentage > 10 && `⚠️ ${analysisData.pollutionPercentage.toFixed(0)}%`}
                        </motion.div>
                    </div>
                </motion.div>

                 <motion.div 
                    className="bg-gray-700/50 p-6 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-xl font-bold mb-4 text-emerald-400">Reports Over Time</h2>
                    <div className="flex justify-between items-end h-48 space-x-2">
                        {analysisData.monthlyData.length > 0 ? (
                            analysisData.monthlyData.map((data, index) => (
                                <div key={data.label} className="flex-1 flex flex-col items-center justify-end">
                                    <p className="text-sm font-bold">{data.value}</p>
                                    <motion.div
                                        className="w-full bg-emerald-500 rounded-t-md"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(data.value / analysisData.maxMonthlyCount) * 100}%` }}
                                        transition={{ duration: 0.5, delay: 0.6 + index * 0.05, ease: "easeOut" }}
                                        title={`${data.label}: ${data.value} reports`}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{data.label}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 w-full text-center">No monthly data available.</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </PageContainer>
    );
};


const NewsPage: React.FC = () => (
    <PageContainer title="Latest Environmental News">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockNewsData.map(article => (
                 <motion.div 
                    key={article.id} 
                    className="bg-gray-700/50 rounded-lg overflow-hidden shadow-lg hover:shadow-emerald-500/20 transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: article.id * 0.1 }}
                >
                    <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
                    <div className="p-6">
                        <h3 className="font-bold text-xl mb-2 text-emerald-400">{article.title}</h3>
                        <p className="text-gray-300 text-base mb-4">{article.excerpt}</p>
                        <p className="text-gray-500 text-sm">{new Date(article.date).toLocaleDateString()}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </PageContainer>
);

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Alex Green");
    const [email, setEmail] = useState("alex.green@example.com");

    const [tempName, setTempName] = useState(name);
    const [tempEmail, setTempEmail] = useState(email);

    const handleEdit = () => {
        setTempName(name);
        setTempEmail(email);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setName(tempName);
        setEmail(tempEmail);
        setIsEditing(false);
    };

    return (
        <PageContainer title="My Profile">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <motion.div layout>
                    <img src="https://picsum.photos/seed/profile/150" alt="Profile" className="w-32 h-32 rounded-full ring-4 ring-emerald-500" />
                </motion.div>
                
                <div className="flex-1 w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.form
                                key="edit-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSave}
                                className="w-full"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm font-bold mb-2">Name</label>
                                        <input 
                                            type="text" 
                                            value={tempName} 
                                            onChange={e => setTempName(e.target.value)} 
                                            className="w-full max-w-sm bg-gray-700 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                                        <input 
                                            type="email" 
                                            value={tempEmail} 
                                            onChange={e => setTempEmail(e.target.value)} 
                                            className="w-full max-w-sm bg-gray-700 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex space-x-4">
                                    <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">Save Changes</button>
                                    <button type="button" onClick={handleCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-300">Cancel</button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="display-profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-3xl font-bold">{name}</h2>
                                <p className="text-emerald-400">{email}</p>
                                <p className="mt-2 text-gray-300">Joined on {new Date().toLocaleDateString()}</p>
                                <button onClick={handleEdit} className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md transition-transform duration-300 hover:scale-105">
                                    Edit Profile
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageContainer>
    );
};

const AboutPage = () => {
    const teamMembers = [
        { name: 'Nikhil', role: 'Founder & Lead Developer', seed: 'nikhil' },
        { name: 'Devnand', role: 'Lead UI/UX Designer', seed: 'devnand' },
        { name: 'Sajan', role: 'Backend Architect', seed: 'sajan' },
        { name: 'Rayan', role: 'Frontend Specialist', seed: 'rayan' },
        { name: 'Saniya', role: 'Data & Analytics Lead', seed: 'saniya' },
        { name: 'HEMADG', role: 'Community & Marketing', seed: 'hemadg' },
    ];

    return (
        <PageContainer title="About GreenMap">
            <p className="text-lg leading-relaxed">
                GreenMap is a community-driven platform dedicated to visualizing and tracking environmental actions around the globe. Our mission is to empower individuals and organizations to make a tangible impact by mapping both positive contributions, like tree plantations, and areas of concern, such as pollution hotspots.
            </p>
            <p className="mt-4 text-lg leading-relaxed">
                By providing a clear, interactive map, we aim to raise awareness, encourage participation, and foster a global community committed to protecting our planet. Join us in creating a greener, cleaner world, one report at a time.
            </p>
            <div className="mt-12">
                <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            className="text-center bg-gray-700/50 p-6 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-shadow duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <img
                                src={`https://picsum.photos/seed/${member.seed}/150`}
                                alt={member.name}
                                className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-gray-600"
                            />
                            <h3 className="font-bold text-xl text-white">{member.name}</h3>
                            <p className="text-emerald-400">{member.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
};


// --- MAIN APP COMPONENT & ROUTER ---

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
    const [reports, setReports] = useState<Report[]>(() => {
        try {
            const savedReports = localStorage.getItem('greenmap_reports');
            return savedReports ? JSON.parse(savedReports) : initialReports;
        } catch (error) {
            console.error("Failed to load reports from localStorage", error);
            return initialReports;
        }
    });
    const location = useLocation();

    useEffect(() => {
        try {
            localStorage.setItem('greenmap_reports', JSON.stringify(reports));
        } catch (error) {
            console.error("Failed to save reports to localStorage", error);
        }
    }, [reports]);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setShowWelcomeScreen(true);
        setTimeout(() => {
            setShowWelcomeScreen(false);
        }, 2500);
    };
    const handleLogout = () => setIsAuthenticated(false);

    const addReport = (reportData: Omit<Report, 'id' | 'reportedBy' | 'timestamp'>) => {
        const newReport: Report = {
            ...reportData,
            id: new Date().toISOString() + Math.random(), // Add random number to ensure unique ID
            reportedBy: 'Alex Green', // Mock user
            timestamp: new Date().toISOString(),
        };
        setReports(prev => [...prev, newReport]);
    };
    
    const updateReport = (updatedReport: Report) => {
        setReports(prevReports => 
            prevReports.map(report => 
                report.id === updatedReport.id ? updatedReport : report
            )
        );
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

    return (
        <>
            <AnimatePresence>
                {showWelcomeScreen && <WelcomeScreen username="Alex Green" />}
            </AnimatePresence>
            <div className={`flex h-screen bg-gray-900 overflow-hidden transition-filter duration-500 ${showWelcomeScreen ? 'filter blur-sm' : ''}`}>
                <Sidebar onLogout={handleLogout} />
                <main className={`flex-1 ${isDashboard ? '' : 'overflow-y-auto'}`}>
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/dashboard" element={<DashboardPage reports={reports} addReport={addReport} updateReport={updateReport} />} />
                            <Route path="/reports" element={<ReportsPage reports={reports} />} />
                            <Route path="/analysis" element={<AnalysisPage reports={reports} />} />
                            <Route path="/news" element={<NewsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </AnimatePresence>
                </main>
                <Chatbot />
            </div>
        </>
    );
};

const RootApp: React.FC = () => (
    <HashRouter>
        <App />
    </HashRouter>
);

export default RootApp;
