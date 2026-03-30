document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.content-section');

    // Lưu lại nội dung gốc của các section để reset khi xóa search
    const originalContents = Array.from(sections).map(s => s.innerHTML);

    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        const lowerQuery = query.toLowerCase();

        sections.forEach((section, index) => {
            // Reset nội dung về ban đầu trước khi highlight mới
            section.innerHTML = originalContents[index];

            if (lowerQuery === "") {
                section.style.display = "block";
                return;
            }

            const sectionText = section.innerText.toLowerCase();

            if (sectionText.includes(lowerQuery)) {
                section.style.display = "block";
                
                // Kỹ thuật Highlight: Thay thế chữ khớp bằng thẻ span.highlight
                const regex = new RegExp(`(${query})`, 'gi');
                highlightTextNodes(section, regex);
            } else {
                section.style.display = "none";
            }
        });
    });

    // Hàm bổ trợ để chỉ highlight văn bản, không làm hỏng thẻ HTML
    function highlightTextNodes(element, regex) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToReplace = [];
        while (node = walker.nextNode()) {
            if (node.nodeValue.match(regex)) nodesToReplace.push(node);
        }
        nodesToReplace.forEach(node => {
            const span = document.createElement('span');
            span.innerHTML = node.nodeValue.replace(regex, '<span class="highlight">$1</span>');
            node.parentNode.replaceChild(span, node);
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const searchInput = document.getElementById('searchInput');

    // HÀM HIỂN THỊ MỤC ĐƯỢC CHỌN
    function activateSection(targetId) {
        // Ẩn tất cả section và xóa màu menu cũ
        sections.forEach(s => s.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active-menu'));

        // Hiển thị section mục tiêu (xử lý cả trường hợp targetId là chuỗi "#id")
        const target = document.querySelector(targetId);
        if (target) {
            target.classList.add('active');
            // Cập nhật trạng thái menu bên trái
            const menuLink = document.querySelector(`a[href="${targetId}"]`);
            if (menuLink) menuLink.classList.add('active-menu');
        }
    }

    // 1. XỬ LÝ KHI CLICK MENU SIDEBAR
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            activateSection(id);
        });
    });

    // 2. XỬ LÝ KHI TÌM KIẾM (SEARCH)
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query === "") {
            // Nếu xóa trắng ô search, giữ nguyên section hiện tại hoặc về mặc định
            return;
        }

        // Quét qua tất cả các section để tìm từ khóa
        sections.forEach(section => {
            const sectionContent = section.innerText.toLowerCase();
            if (sectionContent.includes(query)) {
                // Nếu tìm thấy chữ khớp ở mục nào, tự động nhảy sang mục đó
                activateSection('#' + section.id);
            }
        });
    });

    // 3. MẶC ĐỊNH: Khi mới mở trang, chỉ hiện mục đầu tiên (A1-A3)
    activateSection('#A1-A3');
});
