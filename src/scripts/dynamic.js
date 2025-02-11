document.addEventListener('DOMContentLoaded', () => {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const input3 = document.getElementById('input3');
    const yamlInput = document.getElementById('yamlInput');
    const selectionBox2 = input2.closest('.selection-box');
    const selectionBox3 = input3.closest('.selection-box');
    let currentYamlData = null;
    let drawingReady = false;

    function initializeUI() {
        // Ensure inputs are cleared and boxes are disabled
        selectionBox2.classList.add('disabled');
        selectionBox3.classList.add('disabled');
        clearAllSelections();
        
        // Only try to draw if the drawing system is ready
        if (drawingReady) {
            window.drawingState.paths = [];
            drawPaths();
        }
    }

    function clearAllSelections() {
        [input1, input2, input3].forEach(input => {
            input.value = '';
            const box = input.closest('.selection-box');
            box.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
            box.querySelector('.option[data-value=""]')?.classList.add('selected');
        });
    }

    function handleOptionClick(event) {
        const button = event.target;
        const value = button.getAttribute('data-value');
        const selectionBox = button.closest('.selection-box');
        const input = selectionBox.querySelector('input[type="hidden"]');
        
        // Handle button selection
        selectionBox.querySelectorAll('.option').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        input.value = value;

        // Handle dependencies
        if (input === input1) {
            if (value) {
                selectionBox2.classList.remove('disabled');
            } else {
                selectionBox2.classList.add('disabled');
                selectionBox3.classList.add('disabled');
                input2.value = '';
                input3.value = '';
                resetSelectionBox(selectionBox2);
                resetSelectionBox(selectionBox3);
            }
        } else if (input === input2) {
            if (value && input1.value) {
                selectionBox3.classList.remove('disabled');
            } else {
                selectionBox3.classList.add('disabled');
                input3.value = '';
                resetSelectionBox(selectionBox3);
            }
        }

        // Update display if we have data
        if (currentYamlData) {
            updateDisplay();
        }
    }

    function resetSelectionBox(box) {
        box.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
        box.querySelector('.option[data-value=""]').classList.add('selected');
    }

    function updateDisplay() {
        if (!currentYamlData || !drawingReady) return;

        const inputs = [
            input1.value.toLowerCase(),
            input2.value.toLowerCase(),
            input3.value.toLowerCase()
        ];

        console.log('Updating display with inputs:', inputs);
        
        // Clear existing paths
        window.drawingState.paths = [];

        if (!inputs[0]) {
            drawPaths();
            return;
        }

        // Find matching path sets
        let matchingPaths = window.pathUtils.filterPathSets(currentYamlData, inputs.filter(Boolean));
        console.log('Found matching paths:', matchingPaths);

        if (matchingPaths.length > 0) {
            const pathSet = matchingPaths[0];
            const setName = Object.keys(pathSet)[0];
            const pathsData = pathSet[setName];

            // Build paths array
            const newPaths = [];
            
            if (pathsData[inputs[0].toUpperCase()]) {
                newPaths.push({
                    path: pathsData[inputs[0].toUpperCase()].Coords.map(coord => ({ x: coord[0], y: coord[1] })),
                    color: colors[0],
                    label: inputs[0].toUpperCase()
                });
                selectionBox2.classList.remove('disabled');
            }

            if (inputs[1] && pathsData[inputs[1].toUpperCase()]) {
                newPaths.push({
                    path: pathsData[inputs[1].toUpperCase()].Coords.map(coord => ({ x: coord[0], y: coord[1] })),
                    color: colors[1],
                    label: inputs[1].toUpperCase()
                });
                selectionBox3.classList.remove('disabled');
            }

            if (inputs[2] && pathsData[inputs[2].toUpperCase()]) {
                newPaths.push({
                    path: pathsData[inputs[2].toUpperCase()].Coords.map(coord => ({ x: coord[0], y: coord[1] })),
                    color: colors[2],
                    label: inputs[2].toUpperCase()
                });
            }

            window.drawingState.paths = newPaths;
            console.log('Setting paths:', newPaths);
        }

        drawPaths();
    }

    // Wait for drawing system to be ready
    window.addEventListener('drawingReady', () => {
        drawingReady = true;
        currentYamlData = jsyaml.load(window.defaultYaml);
        console.log('Drawing system ready, YAML loaded');
        initializeUI();
    });

    // Initialize event listeners
    document.querySelectorAll('.option').forEach(button => {
        button.addEventListener('click', handleOptionClick);
    });

    yamlInput?.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            currentYamlData = jsyaml.load(e.target.result);
            updateDisplay();
        };
        reader.readAsText(file);
    });

    // Initialize UI
    initializeUI();
});
