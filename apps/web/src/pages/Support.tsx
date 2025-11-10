import styled from 'styled-components';
import { FaSearch, FaShoppingBag, FaCreditCard, FaUser, FaHeadset, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';
import React, { useState, useMemo } from 'react';
import { allFaqArticles, type FaqArticle } from '../data/faqData'; 
import InputField from '../components/InputField'; 

// ==========================================================
// 1. STYLED COMPONENTS 
// ==========================================================
const PageWrapper = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 30px 40px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border-radius: 8px;
    min-height: 80vh;
`;

const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 30px;
    text-align: center;
    text-transform: uppercase;
    color: #333;
`;

// --- Thanh Tìm Kiếm ---
const SearchBarWrapper = styled.div`
    position: relative;
    width: 70%;
    margin: 0 auto 50px auto;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 18px 25px 18px 60px; 
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 50px; 
    
    &:focus {
        outline: none;
        border-color: #f72d57; 
        box-shadow: 0 0 8px rgba(247, 45, 87, 0.3);
    }
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    left: 25px;
    top: 50%;
    transform: translateY(-50%);
    color: #999; 
`;

// --- Grid Chủ Đề ---
const TopicsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 50px;
`;

const TopicCard = styled.div`
    padding: 25px;
    border: 1px solid #eee;
    border-radius: 8px;
    text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
    cursor: pointer;

    svg {
        font-size: 2.5rem; 
        color: #f72d57; 
        margin-bottom: 15px;
    }
    
    h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #333;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
`;

// --- Phần Liên Hệ ---
const ContactSection = styled.div`
    text-align: center;
    padding: 30px;
    background: #fcfcfc;
    border-radius: 8px;
    border: 1px dashed #ddd; 
    transition: all 0.3s ease-in-out;
`;

const ContactButton = styled.button`
    background-color: #f72d57;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e0204b;
    }
`;

// ==========================================================
// 2. STYLED COMPONENTS DANH SÁCH CÂU HỎI
// ==========================================================

const HelpListWrapper = styled.div`
    animation: fadeIn 0.3s ease-in-out;
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const BackButton = styled.button`
    background: none;
    border: none;
    color: #f72d57;
    font-weight: 600;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        text-decoration: underline;
    }
`;

const QuestionWrapper = styled.div`
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;

    h4 {
        margin: 0 0 5px 0;
        color: #333;
        font-size: 1.1rem;
    }
    p {
        margin: 0;
        color: #555;
        font-size: 0.95rem;
        line-height: 1.6;
    }
`;

const SearchResultWrapper = styled(HelpListWrapper)`
    h2 {
        font-size: 1.3rem;
        font-weight: 700;
        color: #333;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
`;

// ==========================================================
// 3. STYLED COMPONENTS FORM HỖ TRỢ 
// ==========================================================
const FormWrapper = styled.div`
    text-align: left; 
    animation: fadeIn 0.5s ease;
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const FormTitle = styled.h4`
    font-size: 1.2rem;
    color: #333;
    text-align: center;
    margin: 0 0 20px 0;
`;

const StyledForm = styled.form``;

const TextAreaGroup = styled.div`
  margin-bottom: 20px;
`;

const TextAreaLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const StyledTextArea = styled.textarea`
    width: 100%;
    box-sizing: border-box; 
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s;
    min-height: 120px;
    font-family: inherit; 

    &:focus {
        border-color: #f72d57;
        outline: none;
        box-shadow: 0 0 0 1px #f72d57;
    }
`;

const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end; 
    gap: 10px;
    margin-top: 20px;
`;

const CancelButton = styled(ContactButton)`
    background-color: #777;
    &:hover {
        background-color: #555;
    }
`;


// ==========================================================
// 4. COMPONENT CON RENDER  Q&A 
// ==========================================================

type HelpTopicProps = {
    onBack: () => void;
    category: FaqArticle['category']; // 'orders' | 'payment' | ...
    title: string;
}

const HelpTopicList: React.FC<HelpTopicProps> = ({ onBack, category, title }) => {
    // Lọc các câu hỏi theo chủ đề 
    const questions = allFaqArticles.filter(
        article => article.category === category
    );

    return (
        <HelpListWrapper>
            <BackButton onClick={onBack}>
                <FaArrowLeft />
                Quay lại tất cả chủ đề
            </BackButton>
            
            <h2>{title}</h2>

            {questions.map(item => (
                <QuestionWrapper key={item.id}>
                    <h4>{item.question}</h4>
                    <p>{item.answer}</p>
                </QuestionWrapper>
            ))}
        </HelpListWrapper>
    );
}

// ==========================================================
// 5. COMPONENT FORM HỖ TRỢ 
// ==========================================================

type SupportFormProps = {
    onCancel: () => void;
}

const SupportForm: React.FC<SupportFormProps> = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        details: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dữ liệu form đã gửi:", formData);
        alert("Yêu cầu của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm!");
        onCancel(); 
    };
    
    return (
        <FormWrapper>
            <FormTitle>Gửi yêu cầu hỗ trợ</FormTitle>
            <StyledForm onSubmit={handleSubmit}>
                <InputField
                    label="Tên của bạn"
                    id="name"
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={formData.name}
                    onChange={handleChange}
                />
                <InputField
                    label="Email liên hệ"
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                />
                <InputField
                    label="Chủ đề"
                    id="subject"
                    type="text"
                    placeholder="Ví dụ: Vấn đề về đơn hàng #12345"
                    value={formData.subject}
                    onChange={handleChange}
                />
                <TextAreaGroup>
                    <TextAreaLabel htmlFor="details">Mô tả chi tiết</TextAreaLabel>
                    <StyledTextArea
                        id="details"
                        name="details"
                        placeholder="Vui lòng mô tả rõ sự cố bạn đang gặp phải..."
                        value={formData.details}
                        onChange={handleChange}
                    />
                </TextAreaGroup>
                <ButtonRow>
                    <CancelButton type="button" onClick={onCancel}>Hủy</CancelButton>
                    <ContactButton type="submit">Gửi yêu cầu</ContactButton>
                </ButtonRow>
            </StyledForm>
        </FormWrapper>
    );
};


// ==========================================================
// 6. COMPONENT TRANG CHÍNH 
// ==========================================================

const SupportPage: React.FC = () => {
    // --- STATE QUẢN LÝ TRANG (Phần bạn thiếu) ---
    const [activeTopic, setActiveTopic] = useState<FaqArticle['category'] | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); // <-- State 'searchTerm' bị thiếu
    const [isFormVisible, setIsFormVisible] = useState(false);

    // --- LOGIC TÌM KIẾM ---
    const searchResults = useMemo(() => {
        if (searchTerm.length < 3) {
            return [];
        }
        const lowerTerm = searchTerm.toLowerCase();
        
        return allFaqArticles.filter(article => 
            article.question.toLowerCase().includes(lowerTerm) ||
            article.answer.toLowerCase().includes(lowerTerm) ||
            article.keywords.some(k => k.toLowerCase().includes(lowerTerm))
        );
    }, [searchTerm]); 

    
    // --- HÀM RENDER NỘI DUNG ĐỘNG ---
    const renderContent = () => {
        // ƯU TIÊN 1: Hiển thị kết quả tìm kiếm
        if (searchTerm.length > 2) {
            return (
                <SearchResultWrapper>
                    <h2>Kết quả tìm kiếm cho "{searchTerm}":</h2>
                    {searchResults.length > 0 ? (
                        searchResults.map(item => (
                            <QuestionWrapper key={item.id}>
                                <h4>{item.question}</h4>
                                <p>{item.answer}</p>
                            </QuestionWrapper>
                        ))
                    ) : (
                        <p>Không tìm thấy kết quả nào phù hợp.</p>
                    )}
                </SearchResultWrapper>
            );
        }

        // ƯU TIÊN 2: Hiển thị danh sách câu hỏi của chủ đề
        switch (activeTopic) {
            case 'orders':
                return <HelpTopicList 
                            onBack={() => setActiveTopic(null)} 
                            category="orders"
                            title="Đơn hàng & Giao hàng" 
                       />;
            case 'payment':
                return <HelpTopicList 
                            onBack={() => setActiveTopic(null)} 
                            category="payment"
                            title="Thanh toán & Khuyến mãi" 
                       />;
            case 'account':
                return <HelpTopicList 
                            onBack={() => setActiveTopic(null)} 
                            category="account"
                            title="Tài khoản & Hồ sơ" 
                       />;
            case 'policy':
                return <HelpTopicList 
                            onBack={() => setActiveTopic(null)} 
                            category="policy"
                            title="Chính sách & Báo cáo" 
                       />;
        }

        // ƯU TIÊN 3: Hiển thị Grid chủ đề 
        return (
            <TopicsGrid>
                <TopicCard onClick={() => setActiveTopic('orders')}>
                    <FaShoppingBag />
                    <h3>Đơn hàng & Giao hàng</h3>
                </TopicCard>
                <TopicCard onClick={() => setActiveTopic('payment')}>
                    <FaCreditCard />
                    <h3>Thanh toán & Khuyến mãi</h3>
                </TopicCard>
                <TopicCard onClick={() => setActiveTopic('account')}>
                    <FaUser />
                    <h3>Tài khoản & Hồ sơ</h3>
                </TopicCard>
                <TopicCard onClick={() => setActiveTopic('policy')}>
                    <FaQuestionCircle />
                    <h3>Chính sách & Báo cáo</h3>
                </TopicCard>
            </TopicsGrid>
        );
    };

    return (
        <PageWrapper>
            <Title>Trung tâm trợ giúp</Title>
            
            <SearchBarWrapper>
                <SearchIcon />
                <SearchInput 
                    placeholder="Bạn cần trợ giúp về vấn đề gì? (ví dụ: 'hủy đơn')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchBarWrapper>

            {renderContent()}

            <ContactSection>
                {
                    !isFormVisible ? (
                        <>
                            <FaHeadset size={30} style={{ color: '#666', marginBottom: '15px' }} />
                            <h4>Không tìm thấy câu trả lời?</h4>
                            <p>Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
                            <ContactButton onClick={() => setIsFormVisible(true)}>
                                Gửi yêu cầu hỗ trợ
                            </ContactButton>
                        </>
                    ) : (
                        <SupportForm 
                            onCancel={() => setIsFormVisible(false)} 
                        />
                    )
                }
            </ContactSection>
        </PageWrapper>
    );
};

export default SupportPage;