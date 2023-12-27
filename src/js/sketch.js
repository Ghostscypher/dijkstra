const COL = 20;
const ROW = 20;

let cell_size = 0;

// Generate maze
let maze = null;

// Create A_Star object
let dijkstra = null;

// Toggles draw walls off and on
let generate_maze_with_walls = true;

function setup() {
    // Set the cell size based on the window size
    cell_size = Math.floor(Math.min(windowWidth, windowHeight) / COL);
    createCanvas(cell_size * COL, cell_size * ROW);

    // Generate the maze
    maze = generateMaze(COL, ROW, generate_maze_with_walls);

    // Create new Maze
    createNewMaze();

    // Set the frame rate
    frameRate(10);
}

function createNewMaze() {
    // Get random end
    maze = generateMaze(COL, ROW, generate_maze_with_walls);
    let start = maze[0][0];

    // let end = maze[COL - 1][ROW - 1];
    let end = maze[Math.floor(random(COL))][Math.floor(random(ROW))];

    // Create the A_Star object
    dijkstra = new Dijkstra(maze, start, end, COL, ROW);

    if (generate_maze_with_walls) {
        dijkstra.randomlyCloseWalls();
    }
}

// Generate a maze
function generateMaze(cols, rows, with_walls = true) {
    // Create a 2D array
    let maze = new Array(cols);
    for (let i = 0; i < maze.length; i++) {
        maze[i] = new Array(rows);
    }

    let walls = [true, true, true, true];

    if (!with_walls) {
        walls = [false, false, false, false];
    }

    // Create the cells
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            maze[i][j] = new Cell(i, j, cell_size, {
                walls: [...walls]
            });
        }
    }

    // Set the current cell
    let current = maze[0][0];

    // Create a stack
    let stack = [];

    // While there are unvisited cells
    while (true) {
        // Mark the current cell as visited
        current.visited = true;

        // Get a random neighbor
        let next = current.getRandomNeighbor(maze);

        // If there is a neighbor
        if (next) {
            // Push the current cell to the stack
            stack.push(current);

            // Remove the wall between the current cell and the neighbor
            current.removeWall(next);

            // Set the current cell to the neighbor
            current = next;
        } else if (stack.length > 0) {
            // Pop a cell from the stack
            current = stack.pop();
        } else {
            break;
        }
    }

    // Reset the visited property of the cells
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            maze[i][j].visited = false;
        }
    }

    // Return the maze
    return maze;
}

let is_paused = false;
let select_mode = false;

function keyPressed() {
    if (key === 'p' || key === 'P') {
        is_paused = !is_paused;

        if (is_paused) {
            select_mode = true;
            draw();
            noLoop();
        } else {
            select_mode = false;
            start_selected = false;
            end_selected = false;
            loop();
        }
    }

    if (key === 'r' || key === 'R') {
        // Generate the maze
        maze = generateMaze(COL, ROW, generate_maze_with_walls);

        // Generate new maze
        createNewMaze();

        // Reset the loop
        loop();
    }

    if (key === 'w' || key === 'W') {
        generate_maze_with_walls = !generate_maze_with_walls;

        // Generate new maze
        createNewMaze();

        // Reset the loop
        loop();
    }

    if (key === 't' || key === 'T') {
        dijkstra.show_scores = !dijkstra.show_scores;

        // Loop once
        draw();
    }
}

let start_selected = false;
let end_selected = false;

function mousePressed() {
    // If is paused then we can create new start and end
    if (is_paused && select_mode) {
        // Get the x and y coordinates
        let x = Math.floor(mouseX / cell_size);
        let y = Math.floor(mouseY / cell_size);

        if (x < 0 || x >= COL || y < 0 || y >= ROW) {
            return;
        }

        // Get the cell
        let cell = maze[x][y];

        // If start is not selected then select it
        if (mouseButton === LEFT) {
            // Set the start cell
            dijkstra.start = cell;

            // Set the start selected flag
            start_selected = true;
        } else if (mouseButton === RIGHT) {
            // Set the end cell
            dijkstra.end = cell;

            // Set the end selected flag
            end_selected = true;
        }

        // Reset the A_Star object
        dijkstra.reset();

        // Loop once
        draw();
    }
}

function drawGrid() {
    // Draw the grid
    for (let i = 0; i < COL; i++) {
        for (let j = 0; j < ROW; j++) {
            stroke(255, 255, 255, 20);
            strokeWeight(1);
            noFill();
            rect(i * cell_size, j * cell_size, cell_size, cell_size);
        }
    }
}

function draw() {
    // Set the background
    background(0);

    // Draw the grid
    drawGrid();

    // Solve the maze
    if (!select_mode && !this.solved) {
        dijkstra.solve();
    }

    // Draw the maze
    dijkstra.show();

    // Display info
    if (is_paused) {
        fill(255, 255, 255, select_mode ? 255 : 150);
        noStroke();
        textSize(12);
        text(`Mode: ${select_mode ? 'Select' : 'None'}`, 10, 10);
        text(`Paused: ${is_paused ? 'true' : 'false'}`, 10, 20);
        text(`Walls: ${generate_maze_with_walls ? 'true' : 'false'}`, 10, 30);
    }
}