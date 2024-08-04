document.addEventListener('DOMContentLoaded', () => {
    const vehicleForm = document.getElementById('vehicleForm');
    const plateInput = document.getElementById('plate');
    
    const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
    const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
    const historyContent = document.getElementById('historyContent');

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const loadHistory = () => {
        const records = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
        records.forEach(record => addRecordToTable(record));
    };

    const saveRecord = (record) => {
        const records = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
        records.push(record);
        localStorage.setItem('vehicleRecords', JSON.stringify(records));
    };

    const addRecordToTable = (record) => {
        const newRow = historyTable.insertRow(0); 
        
        newRow.insertCell().textContent = record.datetime;
        newRow.insertCell().textContent = record.brand;
        newRow.insertCell().textContent = record.model;
        newRow.insertCell().textContent = record.clave;
        newRow.insertCell().textContent = record.plate;
        newRow.insertCell().textContent = record.color;
        newRow.insertCell().textContent = record.owner;
        newRow.insertCell().textContent = record.habitacion;
        newRow.insertCell().textContent = record.garage;
        newRow.insertCell().textContent = record.observations;
        
        const imageCell = newRow.insertCell();
        record.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.width = 100;
            img.addEventListener('click', () => openFullscreen(img));
            imageCell.appendChild(img);
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(vehicleForm);
        const images = await Promise.all(Array.from(formData.getAll('image')).slice(0, 4).map(file => toBase64(file)));
        const record = {
            datetime: formData.get('datetime'),
            brand: formData.get('brand'),
            model: formData.get('model'),
            clave: formData.get('clave'),
            plate: formData.get('plate'),
            color: formData.get('color'),
            owner: formData.get('owner'),
            habitacion: formData.get('habitacion'),
            garage: formData.get('garage'),
            observations: formData.get('observations'),
            images: images
        };

        saveRecord(record);
        addRecordToTable(record);
        vehicleForm.reset();
    };

    const handlePlateInput = () => {
        const records = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
        const record = records.find(record => record.plate === plateInput.value);
        
        if (record) {
            document.getElementById('datetime').value = record.datetime;
            document.getElementById('brand').value = record.brand;
            document.getElementById('model').value = record.model;
            document.getElementById('clave').value = record.clave;
            document.getElementById('color').value = record.color;
            document.getElementById('owner').value = record.owner;
            document.getElementById('habitacion').value = record.habitacion;
            document.getElementById('garage').value = record.garage;
            document.getElementById('observations').value = record.observations;
        }
    };

    const toggleHistoryVisibility = () => {
        if (historyContent.style.display === 'none') {
            historyContent.style.display = 'block';
            toggleHistoryBtn.textContent = 'Ocultar Historial';
        } else {
            historyContent.style.display = 'none';
            toggleHistoryBtn.textContent = 'Mostrar Historial';
        }
    };

    const openFullscreen = (img) => {
        const fullscreenImg = document.createElement('img');
        fullscreenImg.src = img.src;
        fullscreenImg.classList.add('fullscreen-img');
        fullscreenImg.addEventListener('click', () => {
            document.body.removeChild(fullscreenImg);
        });
        document.body.appendChild(fullscreenImg);
    };

    vehicleForm.addEventListener('submit', handleFormSubmit);
    plateInput.addEventListener('input', handlePlateInput);
    toggleHistoryBtn.addEventListener('click', toggleHistoryVisibility);

    loadHistory();
});


