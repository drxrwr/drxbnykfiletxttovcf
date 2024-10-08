document.getElementById('processFilesBtn').addEventListener('click', function() {
    const files = document.getElementById('file-input').files;
    const fileAreas = document.getElementById('file-areas');
    const contactName = document.getElementById('contactNameInput').value.trim() || 'Contact';
    const isNumberingEnabled = document.getElementById('numberingToggle').checked; // Mengambil status tombol toggle

    processFiles(files, contactName, isNumberingEnabled);
});

function processFiles(files, contactName, isNumberingEnabled) {
    const fileAreas = document.getElementById('file-areas');
    fileAreas.innerHTML = ''; // Kosongkan div sebelum menambahkan textarea baru

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const textArea = document.createElement('textarea');
            textArea.classList.add('small-textarea');
            textArea.value = e.target.result;

            const fileNameInput = document.createElement('input');
            fileNameInput.type = 'text';
            fileNameInput.placeholder = 'Masukkan nama file VCF';
            fileNameInput.classList.add('file-name-input');

            const fileNameLabel = document.createElement('label');
            fileNameLabel.textContent = `Nama File Asal: ${file.name}`;
            fileNameLabel.classList.add('file-name-label');

            const generateButton = document.createElement('button');
            generateButton.textContent = 'Generate VCF';
            generateButton.classList.add('generate-vcf-btn');

            generateButton.addEventListener('click', () => {
                const lines = textArea.value.split('\n').map(line => line.trim());
                const filename = fileNameInput.value.trim() || 'contacts';
                let vcfContent = '';
                let contactIndex = 1;
                const contactCount = lines.filter(line => line).length; // Hitung total kontak

                lines.forEach(line => {
                    if (line) {
                        let phoneNumber = line;
                        if (!phoneNumber.startsWith('+')) {
                            phoneNumber = '+' + phoneNumber;
                        }

                        // Format nama kontak berdasarkan status penomoran
                        let formattedIndex;

                        // Tentukan format penomoran berdasarkan jumlah kontak
                        if (isNumberingEnabled) {
                            if (contactCount >= 1 && contactCount <= 10) {
                                formattedIndex = String(contactIndex).padStart(2, '0'); // 2 digit
                            } else if (contactCount >= 11 && contactCount <= 999) {
                                formattedIndex = String(contactIndex).padStart(3, '0'); // 3 digit
                            } else if (contactCount >= 1000 && contactCount <= 9999) {
                                formattedIndex = String(contactIndex).padStart(4, '0'); // 4 digit
                            } else {
                                formattedIndex = contactIndex; // Tidak perlu format
                            }
                            vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}-${formattedIndex}\nTEL:${phoneNumber}\nEND:VCARD\n\n`;
                        } else {
                            vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}${contactIndex}\nTEL:${phoneNumber}\nEND:VCARD\n\n`;
                        }

                        contactIndex++;
                    }
                });

                if (vcfContent) {
                    const blob = new Blob([vcfContent], { type: 'text/vcard' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${filename}.vcf`;
                    a.textContent = `Download ${filename}.vcf`;
                    a.style.display = 'block';
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });

            fileAreas.appendChild(fileNameLabel);
            fileAreas.appendChild(fileNameInput);
            fileAreas.appendChild(textArea);
            fileAreas.appendChild(generateButton);
        };
        reader.readAsText(file);
    });
}
