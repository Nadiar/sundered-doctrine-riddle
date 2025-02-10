document.addEventListener('DOMContentLoaded', () => {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const input3 = document.getElementById('input3');
    const resetButton = document.getElementById('reset-button');
    const imageContainer = document.getElementById('image-container');

    const options = ['l1', 'l2', 'r1', 'r2'];
    const images = {
        'base': 'src/images/map.png', // for null or empty combinations
        'l1l2r1': 'src/images/l1l2r1.png',
        'l1l2r2': 'src/images/l1l2r2.png',
        'l1r1l2': 'src/images/l1r1l2.png',
        'l1r1r2': 'src/images/l1r1r2.png',
        'l1r2l2': 'src/images/l1r2l2.png',
        'l1r2r1': 'src/images/l1r2r1.png',
        'l2l1r1': 'src/images/l2l1r1.png',
        'l2l1r2': 'src/images/l2l1r2.png',
        'l2r1l1': 'src/images/l2r1l1.png',
        'l2r1r2': 'src/images/l2r1r2.png',
        'l2r2l1': 'src/images/l2r2l1.png',
        'l2r2r1': 'src/images/l2r2r1.png',
        'r1l1l2': 'src/images/r1l1l2.png',
        'r1l1r2': 'src/images/r1l1r2.png',
        'r1l2l1': 'src/images/r1l2l1.png',
        'r1l2r2': 'src/images/r1l2r2.png',
        'r1r2l1': 'src/images/r1r2l1.png',
        'r1r2l2': 'src/images/r1r2l2.png',
        'r2l1l2': 'src/images/r2l1l2.png',
        'r2l1r1': 'src/images/r2l1r1.png',
        'r2l2l1': 'src/images/r2l2l1.png',
        'r2l2r1': 'src/images/r2l2r1.png',
        'r2r1l1': 'src/images/r2r1l1.png',
        'r2r1l2': 'src/images/r2r1l2.png',
        'l1l2': 'src/images/l1l2.png',
        'l1r1': 'src/images/l1r1.png',
        'l1r2': 'src/images/l1r2.png',
        'l2r1': 'src/images/l2r1.png',
        'l2r2': 'src/images/l2r2.png',
        'r1r2': 'src/images/r1r2.png',
        'l1': 'src/images/l1.png',
        'l2': 'src/images/l2.png',
        'r1': 'src/images/r1.png',
        'r2': 'src/images/r2.png',
    };

    function createDropdown(input) {
        const datalist = document.createElement('datalist');
        datalist.id = `${input.id}-list`;
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            datalist.appendChild(optionElement);
        });
        input.setAttribute('list', datalist.id);
        document.body.appendChild(datalist);

        input.addEventListener('input', () => {
            const value = input.value.toLowerCase();
            const matches = options.filter(option => option.startsWith(value));
            if (matches.length === 1) {
                input.value = matches[0];
            }
            updateImages();
        });
    }

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
        createDropdown(input);
    });

    resetButton.addEventListener('click', resetInputs);

    // Initialize with base image
    updateImages();
});