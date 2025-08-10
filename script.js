// Menunggu hingga seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------- //
    // --- Seleksi Elemen DOM --- //
    // ----------------------------------- //
    const mainDisplay = document.querySelector('#main-display');
    const historyDisplay = document.querySelector('#history-display');
    const keys = document.querySelector('.calculator-keys');

    // ----------------------------------- //
    // --- Variabel State Kalkulator --- //
    // ----------------------------------- //
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let shouldResetDisplay = false;

    // ----------------------------------- //
    // --- Fungsi Utama --- //
    // ----------------------------------- //

    /**
     * Memperbarui tampilan layar kalkulator berdasarkan state saat ini.
     */
    const updateDisplay = () => {
        mainDisplay.textContent = formatNumber(currentOperand);
        if (operation != null) {
            historyDisplay.textContent = `${formatNumber(previousOperand)} ${operation}`;
        } else {
            historyDisplay.textContent = '';
        }
    };

    /**
     * Menambahkan angka atau titik desimal ke operan saat ini.
     * @param {string} number - Angka atau '.' yang akan ditambahkan.
     */
    const appendNumber = (number) => {
        if (number === '.' && currentOperand.includes('.')) return; // Mencegah ada lebih dari 1 titik
        if (currentOperand === '0' || shouldResetDisplay) {
            currentOperand = number;
            shouldResetDisplay = false;
        } else {
            currentOperand += number;
        }
    };

    /**
     * Memilih operasi matematika (+, -, ×, ÷).
     * @param {string} selectedOperation - Operasi yang dipilih.
     */
    const chooseOperation = (selectedOperation) => {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            calculate(); // Hitung dulu jika sudah ada operasi sebelumnya
        }
        operation = selectedOperation;
        previousOperand = currentOperand;
        currentOperand = '';
        shouldResetDisplay = true; // Siap untuk input angka baru
    };

    /**
     * Melakukan perhitungan matematika.
     */
    const calculate = () => {
        let result;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷':
                if (current === 0) {
                    result = 'Error'; // Menangani pembagian dengan nol
                } else {
                    result = prev / current;
                }
                break;
            default: return;
        }

        currentOperand = result.toString();
        operation = null;
        previousOperand = '';
        shouldResetDisplay = true; // Agar display bisa di-overwrite oleh angka baru
    };

    /**
     * Menangani fungsi-fungsi ilmiah.
     * @param {string} functionName - Nama fungsi (misal: '√', 'x!', 'sin').
     */
    const handleFunction = (functionName) => {
        const num = parseFloat(currentOperand);
        if (isNaN(num) && functionName !== 'π' && functionName !== 'e') return;

        let result;
        switch (functionName) {
            case '√': result = Math.sqrt(num); break;
            case 'x!':
                if (num < 0) { result = 'Error'; break; }
                let fact = 1;
                for (let i = 2; i <= num; i++) fact *= i;
                result = fact;
                break;
            case 'sin': result = Math.sin(num * Math.PI / 180); break; // Asumsi input dalam Derajat
            case 'cos': result = Math.cos(num * Math.PI / 180); break; // Asumsi input dalam Derajat
            case 'tan': result = Math.tan(num * Math.PI / 180); break; // Asumsi input dalam Derajat
            case 'log': result = Math.log10(num); break;
            case 'ln': result = Math.log(num); break;
            case 'x^y': // Ini perlu perlakuan khusus, mirip dengan operator
                 chooseOperation('^');
                 return; // Keluar dari fungsi ini
            case 'π': result = Math.PI; break;
            case 'e': result = Math.E; break;
            case '%': result = num / 100; break;
             // Fungsi lain bisa ditambahkan di sini
        }
        
        currentOperand = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    };


    /**
     * Membersihkan semua state (fungsi AC - All Clear).
     */
    const clearAll = () => {
        currentOperand = '0';
        previousOperand = '';
        operation = null;
        shouldResetDisplay = false;
    };

    /**
     * Memformat angka agar mudah dibaca (misal: menambahkan koma ribuan).
     * @param {string} numberString - Angka dalam bentuk string.
     */
    const formatNumber = (numberString) => {
        if (numberString === 'Error') return 'Error';
        if (numberString === '' || numberString === null) return '';
        const stringNumber = numberString.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('id-ID'); // Menggunakan format lokal Indonesia
        }
        if (decimalDigits != null) {
            return `${integerDisplay},${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    };


    // ----------------------------------- //
    // --- Event Listener Utama --- //
    // ----------------------------------- //
    keys.addEventListener('click', (event) => {
        const key = event.target;
        const keyText = key.textContent;

        if (!key.matches('button')) return; // Abaikan jika yang diklik bukan tombol

        if (key.classList.contains('number')) {
            appendNumber(keyText);
            updateDisplay();
        }

        if (key.classList.contains('operator')) {
            chooseOperation(key.dataset.operator || keyText);
            updateDisplay();
        }
        
        if (key.classList.contains('function')) {
            handleFunction(keyText);
        }

        if (key.classList.contains('equal')) {
            calculate();
            updateDisplay();
        }

        if (key.classList.contains('clear')) {
            clearAll();
            updateDisplay();
        }
    });

    // Inisialisasi tampilan awal
    updateDisplay();
});