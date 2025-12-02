import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import { MOCK_LOCATIONS, type MockLocation } from 'core';

// === STYLED COMPONENTS ===
const Wrapper = styled.div`
    position: relative;
    width: 100%;
`;

const InputGroup = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px 15px;
    background: white;
    transition: all 0.2s;
    
    &:focus-within {
        border-color: #F72D57;
        box-shadow: 0 0 0 2px rgba(247, 45, 87, 0.1);
    }
`;

const StyledInput = styled.input`
    border: none;
    outline: none;
    flex: 1;
    font-size: 1rem;
    margin-left: 10px;
    color: #333;
    
    &::placeholder {
        color: #999;
    }
`;

const SuggestionsList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    list-style: none;
    padding: 0;
    margin: 5px 0 0 0;
    z-index: 1000;
    max-height: 250px;
    overflow-y: auto;
`;

const SuggestionItem = styled.li`
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    transition: background 0.1s;
    
    &:hover {
        background-color: #fff5f7;
        color: #F72D57;
    }
    &:last-child {
        border-bottom: none;
    }

    .icon {
        margin-top: 3px;
        color: #F72D57;
        flex-shrink: 0;
    }

    .text-group {
        display: flex;
        flex-direction: column;
    }

    .name {
        font-weight: 700;
        font-size: 0.95rem;
    }

    .address {
        font-size: 0.8rem;
        color: #666;
    }
`;

// === COMPONENT ===
interface Props {
    onSelect: (address: string, lat: number, lng: number) => void;
    defaultValue?: string;
}

const AddressAutocomplete: React.FC<Props> = ({ onSelect, defaultValue = '' }) => {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<MockLocation[]>([]);
    const [showList, setShowList] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Xử lý lọc danh sách
    useEffect(() => {
        // Nếu ô trống, hiện tất cả để khách chọn
        if (!query.trim()) {
            setSuggestions(MOCK_LOCATIONS);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = MOCK_LOCATIONS.filter(item => 
            item.name.toLowerCase().includes(lowerQuery) || 
            item.address.toLowerCase().includes(lowerQuery)
        );
        setSuggestions(filtered);
    }, [query]);

    // Xử lý click ra ngoài để đóng list
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item: MockLocation) => {
        const fullAddress = `${item.name} - ${item.address}`;
        
        setQuery(fullAddress);
        setShowList(false);
        
        // Trả về dữ liệu quan trọng cho trang Checkout
        onSelect(fullAddress, item.lat, item.lng);
        
        console.log(`Đã chọn: ${item.name} (${item.lat}, ${item.lng})`);
    };

    return (
        <Wrapper ref={wrapperRef}>
            <InputGroup>
                <FaMapMarkerAlt color="#F72D57" />
                <StyledInput 
                    type="text"
                    placeholder="Chọn địa điểm giao hàng..."
                    value={query}
                    onChange={(e) => { 
                        setQuery(e.target.value); 
                        setShowList(true); 
                    }}
                    onFocus={() => setShowList(true)}
                />
                {/* Icon mũi tên nhỏ để báo hiệu đây là dropdown */}
                <FaChevronDown color="#ccc" size={12} />
            </InputGroup>

            {showList && (
                <SuggestionsList>
                    {suggestions.length > 0 ? (
                        suggestions.map((item) => (
                            <SuggestionItem key={item.id} onClick={() => handleSelect(item)}>
                                <FaMapMarkerAlt className="icon" />
                                <div className="text-group">
                                    <span className="name">{item.name}</span>
                                    <span className="address">{item.address}</span>
                                </div>
                            </SuggestionItem>
                        ))
                    ) : (
                        <div style={{padding: '15px', textAlign: 'center', color: '#999', fontSize: '0.9rem'}}>
                            Không tìm thấy địa điểm nào khớp. <br/>
                            Hãy thử "Landmark", "Quận 1"...
                        </div>
                    )}
                </SuggestionsList>
            )}
        </Wrapper>
    );
};

export default AddressAutocomplete;