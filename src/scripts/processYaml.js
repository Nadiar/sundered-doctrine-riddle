document.addEventListener('DOMContentLoaded', () => {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const input3 = document.getElementById('input3');
    const yamlInput = document.getElementById('yamlInput');
    const imageContainer = document.getElementById('image-container');

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

    function processYaml(yamlString) {
        const yamlData = jsyaml.load(yamlString);
        const topLevelKey = Object.keys(yamlData)[0];
        const pathsData = yamlData[topLevelKey];
        
        Object.keys(pathsData).forEach(key => {
            const coords = pathsData[key].Coords;
            const path = coords.map(coord => ({ x: coord[0], y: coord[1] }));
            const color = colors[Object.keys(pathsData).length % colors.length];
            window.drawingState.paths.push({ path, color, label: key });
        });
        
        drawPaths();
    }

    yamlInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            processYaml(e.target.result);
        };
        reader.readAsText(file);
    });

    [input1, input2, input3].forEach(input => {
        createDropdown(input);
    });

    // Initialize with base image
    updateImages();
});
