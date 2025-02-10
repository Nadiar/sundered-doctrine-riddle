document.addEventListener('DOMContentLoaded', () => {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const input3 = document.getElementById('input3');
    const resetButton = document.getElementById('reset-button');
    const imageContainer = document.getElementById('image-container');

    const images = {
        'base': 'images/map.png', // for null or empty combinations
        'l1l2r1': 'images/l1l2r1.png',
        'l1l2r2': 'images/l1l2r2.png',
        'l1r1l2': 'images/l1r1l2.png',
        'l1r1r2': 'images/l1r1r2.png',
        'l1r2l2': 'images/l1r2l2.png',
        'l1r2r1': 'images/l1r2r1.png',
        'l2l1r1': 'images/l2l1r1.png',
        'l2l1r2': 'images/l2l1r2.png',
        'l2r1l1': 'images/l2r1l1.png',
        'l2r1r2': 'images/l2r1r2.png',
        'l2r2l1': 'images/l2r2l1.png',
        'l2r2r1': 'images/l2r2r1.png',
        'r1l1l2': 'images/r1l1l2.png',
        'r1l1r2': 'images/r1l1r2.png',
        'r1l2l1': 'images/r1l2l1.png',
        'r1l2r2': 'images/r1l2r2.png',
        'r1r2l1': 'images/r1r2l1.png',
        'r1r2l2': 'images/r1r2l2.png',
        'r2l1l2': 'images/r2l1l2.png',
        'r2l1r1': 'images/r2l1r1.png',
        'r2l2l1': 'images/r2l2l1.png',
        'r2l2r1': 'images/r2l2r1.png',
        'r2r1l1': 'images/r2r1l1.png',
        'r2r1l2': 'images/r2r1l2.png',
        'l1l2': 'images/l1l2.png',
        'l1r1': 'images/l1r1.png',
        'l1r2': 'images/l1r2.png',
        'l2r1': 'images/l2r1.png',
        'l2r2': 'images/l2r2.png',
        'r1r2': 'images/r1r2.png',
        'l1': 'images/l1.png',
        'l2': 'images/l2.png',
        'r1': 'images/r1.png',
        'r2': 'images/r2.png',
    };

    function updateImages() {
        imageContainer.innerHTML = '';
        const values = [input1.value.toLowerCase(), input2.value.toLowerCase(), input3.value.toLowerCase()].filter(Boolean);
        if (values.length === 0) {
            const img = document.createElement('img');
            img.src = images['base'];
            img.alt = 'base';
            imageContainer.appendChild(img);
            return;
        }
        const combination = values.sort().join('');
        if (images[combination]) {
            const img = document.createElement('img');
            img.src = images[combination];
            img.alt = combination;
            imageContainer.appendChild(img);
        } else {
            values.forEach(value => {
                if (images[value]) {
                    const img = document.createElement('img');
                    img.src = images[value];
                    img.alt = value;
                    imageContainer.appendChild(img);
                }
            });
        }
    }

    function resetInputs() {
        input1.value = '';
        input2.value = '';
        input3.value = '';
        updateImages();
    }

    [input1, input2, input3].forEach(input => {
        input.addEventListener('input', updateImages);
    });

    resetButton.addEventListener('click', resetInputs);

    // Initialize with base image
    updateImages();
});