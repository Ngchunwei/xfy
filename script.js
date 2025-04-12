document.addEventListener('DOMContentLoaded', function() {
    // 设置当前日期
    setCurrentDate();
    
    // 初始化物品选择
    initializeItemSelection();
    
    // 初始化分享按钮
    initializeShareButton();
});

// 设置当前日期
function setCurrentDate() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    dateElement.textContent = `for ${day}/${month}/${year}`;
}

// 初始化物品选择
function initializeItemSelection() {
    const items = document.querySelectorAll('.item');
    
    items.forEach(item => {
        // 点击物品切换选择状态
        item.addEventListener('click', function() {
            toggleItemSelection(this);
        });
        
        // 设置数量控制按钮
        const decreaseBtn = item.querySelector('.decrease');
        const increaseBtn = item.querySelector('.increase');
        
        if (decreaseBtn && increaseBtn) {
            decreaseBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止触发父元素的点击事件
                updateQuantity(item, -1);
            });
            
            increaseBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止触发父元素的点击事件
                updateQuantity(item, 1);
            });
        }
    });
}

// 切换物品选择状态
function toggleItemSelection(item) {
    const quantityControl = item.querySelector('.quantity-control');
    
    if (item.classList.contains('selected')) {
        // 取消选择
        item.classList.remove('selected');
        quantityControl.classList.add('hidden');
    } else {
        // 选择物品
        item.classList.add('selected');
        quantityControl.classList.remove('hidden');
    }
}

// 更新物品数量
function updateQuantity(item, change) {
    const quantityElement = item.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    
    quantity += change;
    
    // 确保数量不小于1
    if (quantity < 1) quantity = 1;
    
    quantityElement.textContent = quantity;
}

// 初始化分享按钮
function initializeShareButton() {
    const shareButton = document.getElementById('share-button');
    
    shareButton.addEventListener('click', function() {
        const purchaseList = generatePurchaseList();
        shareViaWhatsApp(purchaseList);
    });
}

// 生成采购清单
function generatePurchaseList() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    let message = `${day}/${month}/${year} 采购清单\n\n`;
    
    // 获取所有类别
    const categories = document.querySelectorAll('.category');
    let hasItems = false;
    
    categories.forEach(category => {
        const categoryName = category.querySelector('h2').textContent;
        const selectedItems = category.querySelectorAll('.item.selected');
        
        if (selectedItems.length > 0) {
            message += `${categoryName}\n`;
            hasItems = true;
            
            selectedItems.forEach((item, index) => {
                const itemName = item.getAttribute('data-name');
                const quantity = item.querySelector('.quantity').textContent;
                message += `${index + 1}. ${itemName} x${quantity}\n`;
            });
            
            message += '\n';
        }
    });
    
    if (!hasItems) {
        message += '没有选择任何物品';
    }
    
    return message.trim();
}

// 通过WhatsApp分享
function shareViaWhatsApp(text) {
    // 编码文本以便在URL中使用
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    
    // 在新窗口中打开WhatsApp分享链接
    window.open(whatsappUrl, '_blank');
}