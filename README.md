# Sundered Doctrine - Puzzle Encounter

This project helps you find the optimum placement of lenses in the Puzzle encounter of Destiny 2, the Sundered Doctrine dungeon.

## Current Status

The project includes two main functionalities:
1. **Puzzle Encounter Helper**: Helps you find the optimum placement of lenses based on user inputs.
2. **Custom Map Generator**: Allows you to create custom paths on the map and generate YAML files for those paths.

### Files

- **index.html**: The main page for the Puzzle encounter helper.
- **legacy.html**: The previous implementation of the Puzzle encounter helper.
- **generate_map.html**: The page for generating custom paths and exporting them as YAML files.
- **dynamic_map.html**: A dynamic map with paths that can be drawn and reset.

### How to Use

#### Puzzle Encounter Helper

1. Open `index.html` in your browser.
2. Enter the lens placements in the input fields.
3. The map will update based on your inputs.
4. You can also upload a YAML file with custom paths using the file input.

#### Custom Map Generator

1. Open `generate_map.html` in your browser.
2. Use the controls to create and manage paths:
   - **New Path**: Start drawing a new path.
   - **Commit Path**: Save the current path.
   - **Reset Path**: Clear the current path.
   - **New Set**: Create a new set of paths.
   - **Show YAML**: Display the YAML representation of the paths.
3. You can download the YAML file using the "Download" button in the YAML popup.

### Controls

- **New Path**: Click to start drawing a new path on the map.
- **Commit Path**: Click to save the current path.
- **Reset Path**: Click to clear the current path.
- **New Set**: Click to create a new set of paths.
- **Show YAML**: Click to display the YAML representation of the paths. You can copy the YAML to the clipboard or download it as a file.

### Dependencies

- **js-yaml**: Used for parsing and generating YAML data.
- **Canvas API**: Used for drawing paths on the map.

### Contact

For any issues or questions, contact nadiar on Discord. The project is available at [GitHub](https://github.com/Nadiar/sundered-doctrine-riddle).

### Credits

- Map credit goes to u/CyanicKenshi on Reddit.
- Solution credit goes to All_The_Players and [this video](https://www.youtube.com/watch?v=5d-aDb0COpc).