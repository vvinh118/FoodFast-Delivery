export interface FaqArticle {
    id: string;
    category: 'orders' | 'payment' | 'account' | 'policy';
    question: string;
    answer: string;
    keywords: string[]; 
}


export const allFaqArticles: FaqArticle[] = [
    // === Đơn hàng & Giao hàng ===
    {
        id: 'o1',
        category: 'orders',
        question: 'Làm thế nào để tôi theo dõi đơn hàng của mình?',
        answer: 'Bạn có thể theo dõi trạng thái đơn hàng trong thời gian thực tại mục "Lịch sử đơn hàng". Chúng tôi cũng sẽ gửi thông báo qua ứng dụng khi tài xế nhận đơn và đang trên đường giao hàng cho bạn.',
        keywords: ['theo dõi', 'track', 'đơn hàng', 'trạng thái', 'tài xế']
    },
    {
        id: 'o2',
        category: 'orders',
        question: 'Tôi có thể hủy đơn hàng sau khi đã đặt không?',
        answer: 'Bạn có thể hủy đơn hàng miễn phí trong vòng 1 phút sau khi đặt, hoặc trước khi nhà hàng xác nhận đơn. Vui lòng vào "Chi tiết đơn hàng" và nhấn nút "Hủy đơn". Nếu nhà hàng đã bắt đầu chuẩn bị, bạn sẽ không thể hủy đơn.',
        keywords: ['hủy', 'cancel', 'đơn hàng', 'miễn phí']
    },
    {
        id: 'o3',
        category: 'orders',
        question: 'Đồ ăn bị sai hoặc thiếu món, tôi phải làm sao?',
        answer: 'Chúng tôi rất tiếc về sự cố này. Vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi ngay lập tức qua hotline 1900 1234 hoặc mục "Báo cáo sự cố" trong chi tiết đơn hàng, đính kèm hình ảnh món ăn bị sai/thiếu để chúng tôi giải quyết nhanh nhất.',
        keywords: ['sai', 'thiếu', 'nhầm', 'báo cáo', 'sự cố', 'hotline']
    },

    // === Thanh toán & Khuyến mãi ===
    {
        id: 'p1',
        category: 'payment',
        question: 'FoodFast chấp nhận những hình thức thanh toán nào?',
        answer: 'Chúng tôi chấp nhận các hình thức thanh toán: Tiền mặt khi nhận hàng (COD), Thẻ tín dụng/Ghi nợ (Visa, Mastercard), và các loại Ví điện tử phổ biến như Momo, ZaloPay, ShopeePay.',
        keywords: ['thanh toán', 'cod', 'tiền mặt', 'thẻ', 'visa', 'mastercard', 'momo', 'zalopay']
    },
    {
        id: 'p2',
        category: 'payment',
        question: 'Làm thế nào để sử dụng mã khuyến mãi (voucher)?',
        answer: 'Tại bước "Thanh toán", bạn sẽ thấy ô "Mã khuyến mãi". Hãy nhập mã của bạn vào và nhấn "Áp dụng". Hệ thống sẽ tự động trừ số tiền được giảm vào tổng hóa đơn.',
        keywords: ['voucher', 'khuyến mãi', 'giảm giá', 'áp dụng', 'nhập mã']
    },
    {
        id: 'p3',
        category: 'payment',
        question: 'Tại sao mã khuyến mãi của tôi không hoạt động?',
        answer: 'Vui lòng kiểm tra lại các điều kiện của mã: hạn sử dụng, giá trị đơn hàng tối thiểu, phương thức thanh toán áp dụng, và mã có áp dụng cho nhà hàng bạn chọn không. Mỗi đơn hàng chỉ được áp dụng 1 mã khuyến mãi.',
        keywords: ['voucher', 'lỗi', 'không hoạt động', 'hết hạn', 'điều kiện']
    },

    // === Tài khoản & Hồ sơ ===
    {
        id: 'a1',
        category: 'account',
        question: 'Tôi quên mật khẩu, làm sao để lấy lại?',
        answer: 'Tại màn hình Đăng nhập, vui lòng nhấp vào "Quên mật khẩu?". Chúng tôi sẽ gửi một liên kết (hoặc mã OTP) đặt lại mật khẩu đến email hoặc số điện thoại đã đăng ký của bạn.',
        keywords: ['quên mật khẩu', 'password', 'lấy lại', 'đặt lại', 'otp']
    },
    {
        id: 'a2',
        category: 'account',
        question: 'Làm thế nào để thay đổi số điện thoại hoặc địa chỉ email?',
        answer: 'Bạn có thể cập nhật thông tin cá nhân của mình trong mục "Tài khoản" -> "Chi tiết thông tin". Vì lý do bảo mật, bạn sẽ cần xác thực OTP khi thay đổi số điện thoại.',
        keywords: ['thay đổi', 'cập nhật', 'email', 'số điện thoại', 'sđt', 'hồ sơ']
    },
    {
        id: 'a3',
        category: 'account',
        question: 'Điểm thưởng (Reward Points) dùng để làm gì?',
        answer: 'Điểm thưởng được tích lũy sau mỗi đơn hàng thành công. Bạn có thể dùng điểm này để đổi lấy các voucher giảm giá độc quyền hoặc trừ trực tiếp vào đơn hàng tiếp theo (tùy theo chương trình).',
        keywords: ['điểm', 'thưởng', 'reward', 'points', 'đổi voucher']
    },

    // === Chính sách & Báo cáo ===
    {
        id: 'po1',
        category: 'policy',
        question: 'Chính sách hoàn tiền của FoodFast như thế nào?',
        answer: 'Chúng tôi sẽ hoàn tiền 100% cho các trường hợp đơn hàng bị hủy bởi hệ thống, nhà hàng, hoặc khi món ăn giao đến không đúng/bị hư hỏng (khi có bằng chứng xác thực). Tiền sẽ được hoàn vào phương thức thanh toán ban đầu của bạn trong 3-5 ngày làm việc.',
        keywords: ['hoàn tiền', 'refund', 'chính sách', 'hủy đơn', 'hư hỏng']
    },
    {
        id: 'po2',
        category: 'policy',
        question: 'Tôi muốn báo cáo thái độ của tài xế hoặc chất lượng nhà hàng.',
        answer: 'Chúng tôi rất coi trọng phản hồi của bạn. Sau khi đơn hàng hoàn tất, bạn có thể đánh giá tài xế và nhà hàng. Đối với các vấn đề nghiêm trọng, vui lòng vào mục "Trợ giúp" -> "Báo cáo sự cố" và cung cấp chi tiết để chúng tôi xem xét.',
        keywords: ['báo cáo', 'tài xế', 'nhà hàng', 'chất lượng', 'thái độ', 'đánh giá']
    }
];