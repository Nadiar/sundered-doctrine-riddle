document.addEventListener('DOMContentLoaded', () => {
    const yamlInput = document.getElementById('yamlInput');
    let yamlData = null;

    function processYaml(yamlContent) {
        yamlData = jsyaml.load(yamlContent);
        console.log('YAML data processed:', yamlData);
    }

    function loadDefaultYaml() {
        try {
            processYaml(window.defaultYaml);
            console.log('Default YAML data loaded successfully');
        } catch (error) {
            console.error('Error loading default YAML:', error);
            alert('Failed to process default YAML data.');
        }
    }

    yamlInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            processYaml(e.target.result);
        };
        reader.readAsText(file);
    });

    // Drag and drop functionality
    document.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    document.addEventListener('drop', (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
            const reader = new FileReader();
            reader.onload = (e) => {
                processYaml(e.target.result);
            };
            reader.readAsText(file);
        } else {
            alert('Invalid file type. Please drop a YAML file.');
        }
    });

    // Initialize drawing state
    if (!window.drawingState) {
        window.drawingState = {
            currentPath: [],
            scale: 1,
            isDragging: false,
            dragIndex: -1,
            isDrawing: false,
            paths: []
        };
    }

    loadDefaultYaml(); // Load default YAML
});
