/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Chat } from '@google/genai';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFDSURBVHhe7dExAQAAAMKg9U/tbwagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4d08AAfyGu3QAAAABJRU5ErkJggg==';

// --- MOCK DATA ---
const initialProperties = [
    { id: 1, title: "BIỆT THỰ MINI SANG TRỌNG", price: "6.5 Tỷ", address: "Đường số 8, Phường 11, Quận Gò Vấp", specs: "4 PN, 5 WC, 80m²", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=400", postedDate: "Đăng hôm nay", agent: { name: "Thảo Nguyễn", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" } },
    { id: 2, title: "NHÀ PHỐ HIỆN ĐẠI, HẺM XE HƠI", price: "7.2 Tỷ", address: "Lê Văn Thọ, Phường 9, Quận Gò Vấp", specs: "5 PN, 6 WC, 95m²", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=400", postedDate: "Đăng hôm qua", agent: { name: "Văn An", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" } },
    { id: 3, title: "CĂN HỘ CAO CẤP QUẬN 2", price: "5.8 Tỷ", address: "Đường Trần Não, Phường An Khánh, Quận 2", specs: "3 PN, 2 WC, 110m²", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400", postedDate: "3 ngày trước", agent: { name: "Minh Hằng", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150" } },
    { id: 4, title: "NHÀ MẶT TIỀN KINH DOANH SẦM UẤT", price: "12 Tỷ", address: "Quang Trung, Phường 10, Quận Gò Vấp", specs: "6 PN, 7 WC, 120m²", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=400", postedDate: "5 ngày trước", agent: { name: "Thảo Nguyễn", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" } },
    { id: 9, title: "NHÀ GẦN CÔNG VIÊN LÀNG HOA", price: "2.9 Tỷ", address: "Cây Trâm, Phường 8, Quận Gò Vấp", specs: "2 PN, 2 WC, 45m²", image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=400", postedDate: "2 tuần trước", agent: { name: "Văn An", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" } },
    { id: 5, title: "BIỆT THỰ SÂN VƯỜN THẢO ĐIỀN", price: "35 Tỷ", address: "Đường Nguyễn Văn Hưởng, Thảo Đền, Quận 2", specs: "5 PN, 6 WC, 350m²", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400", postedDate: "1 tuần trước", agent: { name: "Tuấn Kiệt", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150" } },
    { id: 6, title: "NHÀ PHỐ GIÁ RẺ QUẬN 12", price: "4.1 Tỷ", address: "Đường Hà Huy Giáp, Phường Thạnh Lộc, Quận 12", specs: "3 PN, 3 WC, 60m²", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400", postedDate: "1 tuần trước", agent: { name: "Lan Anh", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" } },
    { id: 10, title: "NHÀ 700 TRIỆU GẦN CHỢ", price: "700 Triệu", address: "Phường Thạnh Xuân, Quận 12", specs: "2 PN, 1 WC, 40m²", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=400", postedDate: "3 tuần trước", agent: { name: "Lan Anh", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" } },
];

const rentalProperties = [
    { id: 7, title: "CHO THUÊ CĂN HỘ MINI FULL NỘI THẤT", price: "8 Triệu/tháng", address: "Phan Xích Long, Quận Phú Nhuận", specs: "1 PN, 1 WC, 45m²", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400", postedDate: "Đăng hôm nay", agent: { name: "Hoàng Minh", avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=150" } },
    { id: 8, title: "CHO THUÊ NHÀ NGUYÊN CĂN GÒ VẤP", price: "15 Triệu/tháng", address: "Phạm Văn Chiêu, Phường 14, Quận Gò Vấp", specs: "3 PN, 3 WC, 70m²", image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=400", postedDate: "2 ngày trước", agent: { name: "Thảo Nguyễn", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" } },
    { id: 11, title: "CHO THUÊ PHÒNG TRỌ 2 TRIỆU", price: "2 Triệu/tháng", address: "Lê Đức Thọ, Quận Gò Vấp", specs: "1 PN, 1 WC, 25m²", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400", postedDate: "4 ngày trước", agent: { name: "Hoàng Minh", avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=150" } },
    { id: 12, title: "CHO THUÊ VĂN PHÒNG 60 TRIỆU", price: "60 Triệu/tháng", address: "Nguyễn Kiệm, Quận Phú Nhuận", specs: "1 sàn, 2 WC, 150m²", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=400", postedDate: "1 tuần trước", agent: { name: "Thảo Nguyễn", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" } },
];

const initialProjects = [
    { id: 1, name: "Vinhomes Grand Park", location: "Quận 9, TP. Thủ Đức", status: "Đang mở bán", image: "https://images.unsplash.com/photo-1593444799303-99d5a18a2e1e?q=80&w=400", description: "Đại đô thị thông minh đẳng cấp quốc tế, mang đến không gian sống lý tưởng với đầy đủ tiện ích hiện đại và mảng xanh rộng lớn." },
    { id: 2, name: "The Global City", location: "Phường An Phú, TP. Thủ Đức", status: "Sắp ra mắt", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400", description: "Một 'Downtown' mới của TPHCM, là một khu đô thị phức hợp chuẩn quốc tế được thiết kế và quy hoạch bởi công ty kiến trúc hàng đầu thế giới đến từ Anh Quốc Foster + Partners." },
];

const initialNews = [
    { id: 1, title: "Thị trường BĐS Gò Vấp: Điểm sáng cuối năm 2024", date: "20/07/2024", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400", excerpt: "Gò Vấp tiếp tục là khu vực có giao dịch sôi động bậc nhất TPHCM nhờ hạ tầng phát triển và nhu cầu ở thực cao...", content: "Với lợi thế về vị trí, hạ tầng giao thông ngày càng hoàn thiện và mật độ dân cư đông đúc, Gò Vấp luôn là một trong những quận có thị trường bất động sản sôi động nhất TP.HCM. Các chuyên gia dự báo, trong những tháng cuối năm 2024, phân khúc nhà phố và đất nền trong các hẻm xe hơi sẽ tiếp tục thu hút sự quan tâm lớn từ cả người mua ở thực và các nhà đầu tư." },
    { id: 2, title: "5 Lưu ý quan trọng khi vay ngân hàng mua nhà", date: "15/07/2024", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400", excerpt: "Vay vốn ngân hàng là giải pháp tài chính phổ biến, nhưng cần cẩn trọng để tránh các rủi ro không đáng có...", content: "Trước khi quyết định vay ngân hàng, người mua cần xem xét kỹ lưỡng khả năng tài chính của bản thân, lựa chọn gói vay với lãi suất và thời hạn phù hợp, đọc kỹ hợp đồng tín dụng, và chuẩn bị đầy đủ hồ sơ pháp lý. Việc tư vấn với chuyên gia tài chính hoặc chuyên viên bất động sản kinh nghiệm là vô cùng cần thiết để đưa ra quyết định đúng đắn." },
];
// --- END MOCK DATA ---


type Property = {
    id: number;
    title: string;
    price: string;
    address: string;
    specs: string;
    image: string;
    postedDate: string;
    agent: {
        name: string;
        avatar: string;
    };
};

type Project = {
    id: number;
    name: string;
    location: string;
    status: string;
    image: string;
    description: string;
}

type NewsArticle = {
    id: number;
    title: string;
    date: string;
    image: string;
    excerpt: string;
    content: string;
}

type Message = {
    sender: 'user' | 'ai';
    text: string;
};

// --- PRICE FILTER UTILS ---
const parsePrice = (priceStr: string): number => {
    const cleanedStr = priceStr.toLowerCase().replace(/,/g, '');
    let value = parseFloat(cleanedStr.replace(/[^0-9.]/g, ''));
    if (cleanedStr.includes('tỷ')) {
        value *= 1000; // Convert to millions
    }
    return value;
};

const priceRanges = {
    sale: [
        { label: "Dưới 500 Triệu", slug: 'duoi-500-trieu', min: 0, max: 500 },
        { label: "500 - 800 Triệu", slug: '500-800-trieu', min: 500, max: 800 },
        { label: "800 Triệu - 1 Tỷ", slug: '800-trieu-1-ty', min: 800, max: 1000 },
        { label: "Giá từ: 1 Tỷ - 2 Tỷ", slug: '1-2-ty', min: 1000, max: 2000 },
        { label: "Giá từ: 2 Tỷ - 3 Tỷ", slug: '2-3-ty', min: 2000, max: 3000 },
        { label: "Giá từ: 3 Tỷ - 5 Tỷ", slug: '3-5-ty', min: 3000, max: 5000 },
        { label: "Giá từ: 5 Tỷ - 7 Tỷ", slug: '5-7-ty', min: 5000, max: 7000 },
        { label: "Giá từ: 7 Tỷ - 10 Tỷ", slug: '7-10-ty', min: 7000, max: 10000 },
        { label: "Giá từ: 10 Tỷ - 20 Tỷ", slug: '10-20-ty', min: 10000, max: 20000 },
        { label: "Giá từ: 20 Tỷ - 30 Tỷ", slug: '20-30-ty', min: 20000, max: 30000 },
        { label: "Giá: Trên 30 Tỷ", slug: 'tren-30-ty', min: 30000, max: Infinity },
    ],
    rent: [
        { label: "Cho Thuê Chung Cư", slug: 'chung-cu', type: true }, // Placeholder for different filtering logic
        { label: "Cho Thuê Biệt Thự", slug: 'biet-thu', type: true },
        { label: "Cho Thuê Văn Phòng", slug: 'van-phong', type: true },
        { label: "Nhà Mặt Phố", slug: 'mat-pho', type: true },
        { label: "Cho Thuê Phòng Trọ", slug: 'phong-tro', type: true },
        { label: "Giá từ: 1 - 3 Triệu", slug: '1-3-trieu', min: 1, max: 3 },
        { label: "Giá từ: 3 - 5 Triệu", slug: '3-5-trieu', min: 3, max: 5 },
        { label: "Giá từ: 5 - 10 Triệu", slug: '5-10-trieu', min: 5, max: 10 },
        { label: "Giá từ: 10 - 40 Triệu", slug: '10-40-trieu', min: 10, max: 40 },
        { label: "Giá từ: 40 - 70 Triệu", slug: '40-70-trieu', min: 40, max: 70 },
        { label: "Giá từ: 70 - 100 Triệu", slug: '70-100-trieu', min: 70, max: 100 },
    ]
};
// --- END PRICE FILTER UTILS ---


const Header = ({ onNavigate }) => {
    return (
        <header className="app-header">
            <div className="container">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
                    <img src={logoBase64} alt="Thảo Chốt Nhanh - Nhà An Tâm Logo" className="logo-image" />
                </a>
                <nav className="main-nav">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Nhà Bán</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('rentals'); }}>Nhà Cho Thuê</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('projects'); }}>Dự Án</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('news'); }}>Tin Tức</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>Liên Hệ</a>
                </nav>
                <button className="post-listing-btn" onClick={() => onNavigate('post-choice')}>Đăng Tin Mới</button>
            </div>
        </header>
    );
};

const FeaturedPropertyCard = ({ property, onClick }) => (
    <div className="featured-property-card" style={{ backgroundImage: `url(${property.image})` }} onClick={onClick}>
        <div className="card-overlay">
            <h4 className="card-price">{property.price}</h4>
            <h3 className="card-title">{property.title}</h3>
            <p className="card-address">{property.address}</p>
        </div>
    </div>
);

const PropertyListItem = ({ property, onChatClick }: { property: Property, onChatClick: (property: Property) => void }) => {
    return (
        <div className="property-list-item">
            <div className="property-list-item-image">
                <img src={property.image} alt={property.title} />
            </div>
            <div className="property-list-item-info">
                <h3><a href="#">{property.title}</a></h3>
                <p className="property-price">{property.price}</p>
                <p className="property-address">{property.address}</p>
                <p className="property-specs">{property.specs}</p>
                <p className="property-posted-date">{property.postedDate}</p>
            </div>
            <div className="property-list-item-agent">
                <img src={property.agent.avatar} alt={property.agent.name} className="agent-avatar" />
                <p className="agent-name">{property.agent.name}</p>
                <a href="tel:0972052176" className="agent-contact-btn phone">Gọi điện</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onChatClick(property); }} className="agent-contact-btn">Chat</a>
            </div>
        </div>
    );
};


const AIGuide = () => {
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setAnswer('');
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Bạn là một chuyên gia tư vấn bất động sản tại Gò Vấp, TPHCM. Dựa vào yêu cầu sau, hãy đưa ra lời khuyên ngắn gọn (khoảng 100-150 chữ) về loại hình nhà, khu vực, và mức giá phù hợp. Yêu cầu: "${prompt}"`,
            });
            setAnswer(response.text);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setAnswer("Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="widget ai-guide">
            <h2>AI Cố Vấn Nhà Đất</h2>
            <div className="form-group">
                <label htmlFor="ai-prompt">Nhu cầu của bạn là gì?</label>
                <textarea
                    id="ai-prompt"
                    className="form-control"
                    rows={4}
                    placeholder="Ví dụ: Gia đình có 4 người, 2 vợ chồng và 2 con nhỏ, tài chính khoảng 6 tỷ, cần tìm nhà gần trường học, hẻm xe hơi..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>
            <button className="search-button" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Đang phân tích...' : 'Nhận Tư Vấn'}
            </button>
            {isLoading && <div className="loader"><div className="spinner"></div></div>}
            {answer && <div className="ai-answer"><p>{answer}</p></div>}
        </div>
    );
};

const AIChatModal = ({ property, onClose }: { property: Property, onClose: () => void }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        const initialGreeting = {
            sender: 'ai' as const,
            text: "Xin chào! Em là chuyên viên tư vấn cho bất động sản này. Rất hân hạnh được hỗ trợ Anh/Chị."
        };
        setMessages([initialGreeting]);

        const systemInstruction = `Bạn là một trợ lý AI chuyên nghiệp, am hiểu về bất động sản, đóng vai trò là chuyên viên tư vấn cho bất động sản cụ thể mà người dùng đang xem. Nhiệm vụ của bạn là trả lời các câu hỏi của khách hàng về bất động sản này một cách thân thiện, chi tiết và chính xác. Luôn giữ thái độ chuyên nghiệp và hữu ích.
        
        Thông tin về bất động sản khách hàng đang quan tâm:
        - Tiêu đề: ${property.title}
        - Giá: ${property.price}
        - Địa chỉ: ${property.address}
        - Thông số: ${property.specs}`;
        
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
        setChat(newChat);
    }, [property]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: userInput });
            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { sender: 'ai', text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="chat-header">
                    <h3>Tư vấn AI - {property.title}</h3>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    {isLoading && <div className="chat-message ai"><div className="typing-indicator"><span></span><span></span><span></span></div></div>}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Đặt câu hỏi về bất động sản này..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>{isLoading ? '...' : 'Gửi'}</button>
                </form>
            </div>
        </div>
    );
};

const districts = ["Quận Gò Vấp", "Quận 12", "Quận 2", "Quận Tân Bình", "Quận Phú Nhuận"];

const PriceCategoryWidget = ({ onNavigate }) => {
    return (
        <div className="widget price-category-widget">
            <h2>DANH MỤC THEO GIÁ</h2>
            <div className="price-category-grid">
                <div className="price-category-column">
                    <h4>Cần Bán</h4>
                    <ul>
                        {priceRanges.sale.map(range => (
                            <li key={range.slug}><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(`price/sale/${range.slug}`); }}>{range.label}</a></li>
                        ))}
                    </ul>
                </div>
                <div className="price-category-column">
                    <h4>Cho Thuê</h4>
                    <ul>
{/* FIX: Use a type-safe check (`'type' in range`) to prevent accessing a property that may not exist on all items in the array. */}
                        {priceRanges.rent.map(range => (
                            <li key={range.slug}><a href="#" onClick={(e) => { e.preventDefault(); if (!('type' in range)) onNavigate(`price/rent/${range.slug}`); }}>{range.label}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


const Sidebar = ({ onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="widget search-widget">
        <h2>Tìm Kiếm Nâng Cao</h2>
        <div className="form-group">
            <label htmlFor="keyword">Từ khóa</label>
            <input type="text" id="keyword" className="form-control" placeholder="Nhập tiêu đề, địa chỉ..."/>
        </div>
         <div className="form-group price-range">
            <label>Mức giá</label>
            <div className="price-inputs">
                <input type="number" className="form-control" placeholder="Từ" />
                <span>-</span>
                <input type="number" className="form-control" placeholder="Đến" />
            </div>
        </div>
        <button className="search-button">Tìm Kiếm</button>
      </div>
      
      <AIGuide />

      <PriceCategoryWidget onNavigate={onNavigate} />

      <div className="widget category-widget">
        <h2>Danh mục theo Quận/Huyện</h2>
        <ul>
          {districts.map(d => (
            <li key={d}><a href="#" onClick={(e) => { e.preventDefault(); onNavigate(`district/${d}`); }}>{d}</a></li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

const HomePage = ({ onChatClick }) => (
    <>
        <div className="featured-listings">
            <h2>Nhà Bán Nổi Bật</h2>
            <div className="featured-grid">
                {initialProperties.slice(0, 3).map(p => <FeaturedPropertyCard key={p.id} property={p} onClick={() => {}} />)}
            </div>
        </div>
        <div className="property-list-section">
            <h2>Tin Đăng Mới Nhất</h2>
            <div className="listings-container">
                 <div className="property-list">
                    {initialProperties.map(p => <PropertyListItem key={p.id} property={p} onChatClick={onChatClick} />)}
                </div>
            </div>
        </div>
    </>
);

const RentalsPage = ({ onChatClick }) => (
    <div className="listings-container">
         <div className="listings-header">
            <h1>Nhà Cho Thuê</h1>
        </div>
        <div className="property-list">
            {rentalProperties.map(p => <PropertyListItem key={p.id} property={p} onChatClick={onChatClick} />)}
        </div>
    </div>
);

const DistrictCategoryPage = ({ district, onChatClick }) => {
    const propertiesInDistrict = [...initialProperties, ...rentalProperties].filter(p => p.address.includes(district));
    return (
        <div className="listings-container">
            <div className="listings-header">
                <h1>Nhà Đất tại {district}</h1>
            </div>
            <div className="property-list">
                {propertiesInDistrict.length > 0 ? (
                    propertiesInDistrict.map(p => <PropertyListItem key={p.id} property={p} onChatClick={onChatClick} />)
                ) : (
                    <p>Không tìm thấy bất động sản nào tại khu vực này.</p>
                )}
            </div>
        </div>
    );
};

const PriceCategoryPage = ({ category, rangeSlug, onChatClick }) => {
    const allRanges = [...priceRanges.sale, ...priceRanges.rent];
    const range = allRanges.find(r => r.slug === rangeSlug);
    
    if (!range || ('type' in range)) { // Handle case where range is for property type, not price
         return (
             <div className="listings-container">
                <div className="listings-header">
                    <h1>Danh mục chưa được hỗ trợ</h1>
                </div>
                <p>Tính năng lọc theo loại hình bất động sản cho thuê đang được phát triển.</p>
            </div>
         );
    }
    
    const { min, max, label } = range;
    const propertyList = category === 'sale' ? initialProperties : rentalProperties;
    
    const filteredProperties = propertyList.filter(p => {
        const priceValue = parsePrice(p.price);
        return priceValue >= min && priceValue < max;
    });

    return (
        <div className="listings-container">
            <div className="listings-header">
                <h1>{`Bất động sản ${category === 'sale' ? 'Cần Bán' : 'Cho Thuê'}: ${label}`}</h1>
            </div>
            <div className="property-list">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map(p => <PropertyListItem key={p.id} property={p} onChatClick={onChatClick} />)
                ) : (
                    <p>Không tìm thấy bất động sản nào trong khoảng giá này.</p>
                )}
            </div>
        </div>
    );
};


const PostListingPage = () => {
    return (
        <div className="post-listing-page">
            <h1>Đăng Tin Bất Động Sản Mới</h1>
            <p>Tính năng này đang được phát triển. Vui lòng quay lại sau!</p>
        </div>
    );
}

// --- NEW PAGES ---

const ProjectsPage = ({ projects, onNavigate }) => (
    <div className="listings-container">
        <div className="listings-header">
            <h1>Các Dự Án</h1>
        </div>
        <div className="project-list">
            {projects.map(project => (
                <div key={project.id} className="project-card" onClick={() => onNavigate(`project/${project.id}`)}>
                    <div className="project-card-image" style={{ backgroundImage: `url(${project.image})` }}></div>
                    <div className="project-card-info">
                        <h3>{project.name}</h3>
                        <p className="project-location">{project.location}</p>
                        <p className="project-description">{project.description.substring(0, 100)}...</p>
                        <span className="project-status">{project.status}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const NewsPage = ({ news, onNavigate }) => (
    <div className="listings-container">
        <div className="listings-header">
            <h1>Tin Tức</h1>
        </div>
        <div className="news-list">
            {news.map(article => (
                <div key={article.id} className="news-list-item" onClick={() => onNavigate(`news/${article.id}`)}>
                    <div className="news-item-image">
                        <img src={article.image} alt={article.title} />
                    </div>
                    <div className="news-item-content">
                        <h3>{article.title}</h3>
                        <p className="news-item-date">{article.date}</p>
                        <p className="news-item-excerpt">{article.excerpt}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ContactPage = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
        e.currentTarget.reset();
    };

    return (
        <div className="listings-container contact-page">
            <div className="listings-header">
                <h1>Liên Hệ</h1>
            </div>
            <div className="contact-content">
                <div className="contact-info">
                    <h3>Thông Tin Liên Hệ</h3>
                    <p><strong>Chuyên viên:</strong> Thảo Nguyễn</p>
                    <p><strong>Điện thoại:</strong> <a href="tel:0972052176">0972 052 176</a></p>
                    <p><strong>Email:</strong> <a href="mailto:thaonguyen.bds@example.com">thaonguyen.bds@example.com</a></p>
                    <p><strong>Địa chỉ:</strong> 123 Quang Trung, Phường 10, Gò Vấp, TP.HCM</p>
                    <div className="map-container">
{/* FIX: Use boolean attribute `allowFullScreen` instead of `allowFullScreen=""` for React JSX */}
                       <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.858232924403!2d106.6669523152981!3d10.82215889228998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e54736937b%3A0x29737083196c566c!2zUXVhbmcgVHJ1bmcsIEfDsiBW4bqlcCwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1663824588201!5m2!1svi!2s" width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
                <div className="contact-form">
                     <h3>Gửi Yêu Cầu Tư Vấn</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Họ và Tên</label>
                            <input type="text" id="name" className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Số Điện Thoại</label>
                            <input type="tel" id="phone" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Nội dung</label>
                            <textarea id="message" rows={5} className="form-control" required></textarea>
                        </div>
                        <button type="submit" className="search-button">Gửi Liên Hệ</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const PostChoiceModal = ({ onNavigate, onClose }) => (
    <div className="chat-modal-overlay" onClick={onClose}>
        <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="chat-header">
                <h3>Chọn loại tin bạn muốn đăng</h3>
                <button onClick={onClose} className="close-btn">&times;</button>
            </div>
            <div className="post-choice-body">
                <button onClick={() => { onNavigate('post-listing'); onClose(); }}>Đăng Tin Bán/Cho Thuê</button>
                <button onClick={() => { onNavigate('post-project'); onClose(); }}>Đăng Dự Án Mới</button>
                <button onClick={() => { onNavigate('post-news'); onClose(); }}>Đăng Tin Tức Mới</button>
            </div>
        </div>
    </div>
);

const PostProjectPage = ({ onAddProject }: { onAddProject: (project: Project) => void }) => {
// FIX: Correctly type the form submission event and use `e.currentTarget` to ensure type safety. Cast FormData values to `string` to match the `Project` type.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newProject: Project = {
            id: Date.now(),
            name: formData.get('name') as string,
            location: formData.get('location') as string,
            status: formData.get('status') as string,
            image: formData.get('image') as string,
            description: formData.get('description') as string,
        };
        onAddProject(newProject);
        e.currentTarget.reset(); // Reset form after submission
    };
    return (
        <div className="post-listing-page">
            <h1>Đăng Dự Án Mới</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Tên dự án</label><input name="name" type="text" className="form-control" required /></div>
                <div className="form-group"><label>Vị trí</label><input name="location" type="text" className="form-control" required /></div>
                <div className="form-group"><label>Tình trạng</label><input name="status" type="text" className="form-control" required /></div>
                <div className="form-group"><label>URL Hình ảnh</label><input name="image" type="url" className="form-control" required /></div>
                <div className="form-group"><label>Mô tả</label><textarea name="description" rows="5" className="form-control" required></textarea></div>
                <button type="submit" className="search-button">Đăng Dự Án</button>
            </form>
        </div>
    );
};

const PostNewsPage = ({ onAddNews }: { onAddNews: (article: NewsArticle) => void }) => {
// FIX: Correctly type the form submission event and use `e.currentTarget`. Cast FormData values to `string` to match the `NewsArticle` type.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newArticle: NewsArticle = {
            id: Date.now(),
            title: formData.get('title') as string,
            date: new Date().toLocaleDateString('vi-VN'),
            image: formData.get('image') as string,
            excerpt: formData.get('excerpt') as string,
            content: formData.get('content') as string,
        };
        onAddNews(newArticle);
        e.currentTarget.reset(); // Reset form after submission
    };
    return (
        <div className="post-listing-page">
            <h1>Đăng Tin Tức Mới</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Tiêu đề</label><input name="title" type="text" className="form-control" required /></div>
                <div className="form-group"><label>URL Hình ảnh thu nhỏ</label><input name="image" type="url" className="form-control" required /></div>
                <div className="form-group"><label>Đoạn trích dẫn</label><textarea name="excerpt" rows="3" className="form-control" required></textarea></div>
                <div className="form-group"><label>Nội dung đầy đủ</label><textarea name="content" rows="10" className="form-control" required></textarea></div>
                <button type="submit" className="search-button">Đăng Tin</button>
            </form>
        </div>
    );
};

const Footer = () => (
    <footer className="app-footer">
        <p>&copy; 2024 Thảo Chốt Nhanh - Nhà An Tâm. All rights reserved.</p>
    </footer>
);

const App = () => {
    const [page, setPage] = useState('home');
    const [chattingWith, setChattingWith] = useState<Property | null>(null);
    const [projects, setProjects] = useState(initialProjects);
    const [news, setNews] = useState(initialNews);
    const [showPostChoice, setShowPostChoice] = useState(false);

    const handleNavigate = (targetPage: string) => {
        if (targetPage === 'post-choice') {
            setShowPostChoice(true);
        } else {
            setPage(targetPage);
            window.scrollTo(0, 0);
        }
    };
    
    const handleChatClick = (property: Property) => {
        setChattingWith(property);
    };

    const handleCloseChat = () => {
        setChattingWith(null);
    };
    
    const handleAddProject = (newProject: Project) => {
        setProjects(prev => [newProject, ...prev]);
        alert('Đăng dự án thành công!');
        handleNavigate('projects');
    }
    
    const handleAddNews = (newArticle: NewsArticle) => {
        setNews(prev => [newArticle, ...prev]);
        alert('Đăng tin tức thành công!');
        handleNavigate('news');
    }

    const renderPage = () => {
        if (page.startsWith('district/')) {
            const district = page.split('/')[1];
            return <DistrictCategoryPage district={district} onChatClick={handleChatClick} />;
        }
        if (page.startsWith('price/')) {
            const [, category, rangeSlug] = page.split('/');
            return <PriceCategoryPage category={category} rangeSlug={rangeSlug} onChatClick={handleChatClick} />;
        }
// FIX: Add a check to ensure `project` is not undefined before rendering.
        if (page.startsWith('project/')) {
            const projectId = parseInt(page.split('/')[1], 10);
            const project = projects.find(p => p.id === projectId);
            if (!project) return <div className="listings-container"><h2>Project not found</h2></div>;
            return <div className="listings-container"><h2>{project.name}</h2><p>{project.description}</p></div>;
        }
// FIX: Add a check to ensure `article` is not undefined before rendering.
        if (page.startsWith('news/')) {
            const newsId = parseInt(page.split('/')[1], 10);
            const article = news.find(n => n.id === newsId);
            if (!article) return <div className="listings-container"><h2>Article not found</h2></div>;
            return <div className="listings-container"><h2>{article.title}</h2><p>{article.content}</p></div>;
        }

        switch (page) {
            case 'home':
                return <HomePage onChatClick={handleChatClick} />;
            case 'rentals':
                return <RentalsPage onChatClick={handleChatClick} />;
            case 'projects':
                return <ProjectsPage projects={projects} onNavigate={handleNavigate} />;
            case 'news':
                return <NewsPage news={news} onNavigate={handleNavigate} />;
            case 'contact':
                return <ContactPage />;
            case 'post-listing':
                 return <PostListingPage />;
            case 'post-project':
                return <PostProjectPage onAddProject={handleAddProject} />;
            case 'post-news':
                return <PostNewsPage onAddNews={handleAddNews} />;
            default:
                return <HomePage onChatClick={handleChatClick} />;
        }
    };

    return (
        <>
            <Header onNavigate={handleNavigate} />
            <main className="container page-container">
                <div className="main-content">
                    {renderPage()}
                </div>
                <Sidebar onNavigate={handleNavigate} />
            </main>
            <Footer />
            
            {chattingWith && (
                <AIChatModal property={chattingWith} onClose={handleCloseChat} />
            )}
            
            {showPostChoice && (
                <PostChoiceModal onNavigate={handleNavigate} onClose={() => setShowPostChoice(false)} />
            )}
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
