// pdf_viewer.js
document.addEventListener('DOMContentLoaded', function() {
    // Элементы модального окна PDF
    const pdfModal = document.getElementById('pdfModal');
    const closePdfModal = document.getElementById('closePdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    const brochureBtn = document.getElementById('brochureBtn');
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const printPdfBtn = document.getElementById('printPdf');
    
    // Путь к PDF файлу
    const pdfPath = 'PDF/regard_brochure.pdf';
    
    // Открытие модального окна при клике на "Брошюра"
    brochureBtn.addEventListener('click', function(e) {
        e.preventDefault();
        pdfViewer.src = pdfPath;
        pdfModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    });
    
    // Закрытие модального окна
    closePdfModal.addEventListener('click', function() {
        closePdfModalFunc();
    });
    
    // Закрытие при клике вне области контента
    pdfModal.addEventListener('click', function(e) {
        if (e.target === pdfModal) {
            closePdfModalFunc();
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pdfModal.style.display === 'flex') {
            closePdfModalFunc();
        }
    });
    
    // Функция закрытия модального окна
    function closePdfModalFunc() {
        pdfModal.style.display = 'none';
        pdfViewer.src = ''; // Останавливаем загрузку PDF
        document.body.style.overflow = 'auto'; // Восстанавливаем скролл
    }
});