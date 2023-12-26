class Cell {

    constructor(i, j, w, options = {
        walls: [true, true, true, true],
    }) {
        this.i = i;
        this.j = j;
        this.w = w;

        // A* properties
        // F = G + H where G is the distance between the current cell and the start cell and H is the distance between the current cell and the end cell
        // F is score of the cell
        // G is the number of steps from the start cell to the current cell
        // H is the heuristic which is the distance between the current cell and the end cell
        this.f = 0;
        this.g = 0;
        this.h = 0;

        // Walls
        // left: 0
        // right: 1
        // top: 2
        // bottom: 3
        this.walls = options.walls;

        // Visited
        this.visited = options.visited;

        // Previous
        this.previous = undefined;
    }

    getNeighbors(maze) {
        let neighbors = [];

        let top = maze[this.i][this.j - 1];
        let right = maze[this.i + 1] ? maze[this.i + 1][this.j] : undefined;
        let bottom = maze[this.i][this.j + 1];
        let left = maze[this.i - 1] ? maze[this.i - 1][this.j] : undefined;

        // Diagonal neighbors
        let top_right = maze[this.i + 1] ? maze[this.i + 1][this.j - 1] : undefined;
        let top_left = maze[this.i - 1] ? maze[this.i - 1][this.j - 1] : undefined;
        let bottom_right = maze[this.i + 1] ? maze[this.i + 1][this.j + 1] : undefined;
        let bottom_left = maze[this.i - 1] ? maze[this.i - 1][this.j + 1] : undefined;

        // Top, right, bottom, left neighbors
        if (top && !top.walls[2]) {
            neighbors.push(top);
        }

        if (right && !right.walls[3]) {
            neighbors.push(right);
        }

        if (bottom && !bottom.walls[0]) {
            neighbors.push(bottom);
        }

        if (left && !left.walls[1]) {
            neighbors.push(left);
        }

        // If the cell has any walls then skip
        if (this.walls.includes(true)) {
            return neighbors;
        }

        // Diagonal neighbors
        if (top_right && !top_right.walls[2] && !top_right.walls[1] && !top.walls[1] && !right.walls[2]) {
            neighbors.push(top_right);
        }

        if (top_left && !top_left.walls[2] && !top_left.walls[3] && !top.walls[3] && !left.walls[2]) {
            neighbors.push(top_left);
        }

        if (bottom_right && !bottom_right.walls[0] && !bottom_right.walls[1] && !bottom.walls[1] && !right.walls[0]) {
            neighbors.push(bottom_right);
        }

        if (bottom_left && !bottom_left.walls[0] && !bottom_left.walls[3] && !bottom.walls[3] && !left.walls[0]) {
            neighbors.push(bottom_left);
        }


        return neighbors;
    }

    getRandomNeighbor(maze) {
        let neighbors = [];

        let top = maze[this.i][this.j - 1];
        let right = maze[this.i + 1] ? maze[this.i + 1][this.j] : undefined;
        let bottom = maze[this.i][this.j + 1];
        let left = maze[this.i - 1] ? maze[this.i - 1][this.j] : undefined;

        // Diagonal neighbors
        let top_right = maze[this.i + 1] ? maze[this.i + 1][this.j - 1] : undefined;
        let top_left = maze[this.i - 1] ? maze[this.i - 1][this.j - 1] : undefined;
        let bottom_right = maze[this.i + 1] ? maze[this.i + 1][this.j + 1] : undefined;
        let bottom_left = maze[this.i - 1] ? maze[this.i - 1][this.j + 1] : undefined;

        // Top, right, bottom, left neighbors
        if (top && !top.visited) {
            neighbors.push(top);
        }

        if (right && !right.visited) {
            neighbors.push(right);
        }

        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }

        if (left && !left.visited) {
            neighbors.push(left);
        }

        // Diagonal neighbors
        if (top_right && !top_right.visited && !top_right.walls[2] && !top_right.walls[1] && !top.walls[1] && !right.walls[2]) {
            neighbors.push(top_right);
        }

        if (top_left && !top_left.visited && !top_left.walls[2] && !top_left.walls[3] && !top.walls[3] && !left.walls[2]) {
            neighbors.push(top_left);
        }

        if (bottom_right && !bottom_right.visited && !bottom_right.walls[0] && !bottom_right.walls[1] && !bottom.walls[1] && !right.walls[0]) {
            neighbors.push(bottom_right);
        }

        if (bottom_left && !bottom_left.visited && !bottom_left.walls[0] && !bottom_left.walls[3] && !bottom.walls[3] && !left.walls[0]) {
            neighbors.push(bottom_left);
        }

        if (neighbors.length > 0) {
            let r = floor(random(0, neighbors.length));
            return neighbors[r];
        }

        return undefined;
    }

    removeWall(next) {
        let x = this.i - next.i;

        if (x === 1) {
            this.walls[3] = false;
            next.walls[1] = false;
        } else if (x === -1) {
            this.walls[1] = false;
            next.walls[3] = false;
        }

        let y = this.j - next.j;

        if (y === 1) {
            this.walls[0] = false;
            next.walls[2] = false;
        } else if (y === -1) {
            this.walls[2] = false;
            next.walls[0] = false;
        }
    }

    reset() {
        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.visited = false;
        this.previous = undefined;
    }

    highlight(solution = false) {
        let x = this.i * this.w;
        let y = this.j * this.w;

        noStroke();

        if (!solution) {
            fill(0, 255, 0, 20);
        } else {
            fill(255, 0, 0, 20);
        }

        rect(x, y, this.w - 1, this.w - 1);
    }

    showPath(possible = false) {
        let x = this.i * this.w;
        let y = this.j * this.w;

        // noStroke();
        // fill(0, 0, 255, 20);
        // rect(x, y, this.w, this.w);

        // Draw a line from the center of the current cell to the center of the previous cell
        if (!this.previous) {
            return;
        }

        if (!possible) {
            stroke(14, 255, 100, 100);
            strokeWeight(4);
        } else {
            stroke(255, 100, 0, 100);
            strokeWeight(3);
        }

        line(x + this.w / 2, y + this.w / 2, this.previous.i * this.w + this.w / 2, this.previous.j * this.w + this.w / 2);
    }

    showCurrentPath() {
        let x = this.i * this.w;
        let y = this.j * this.w;

        // Draw line from the center of the current cell to the center of the previous cell
        if (!this.previous) {
            return;
        }

        push();
        beginShape()
        noFill();
        stroke(255, 0, 0, 255);
        strokeWeight(3);
        line(x + this.w / 2, y + this.w / 2, this.previous.i * this.w + this.w / 2, this.previous.j * this.w + this.w / 2);
        endShape()
        pop();
    }

    showStart() {
        let x = this.i * this.w;
        let y = this.j * this.w;

        noStroke();
        fill(0, 255, 0, 100);

        // Create a red point
        ellipse(x + this.w / 2, y + this.w / 2, this.w / 2, this.w / 2);
    }

    showEnd() {
        let x = this.i * this.w;
        let y = this.j * this.w;

        noStroke();
        fill(255, 0, 0, 100);

        // Create a red point
        ellipse(x + this.w / 2, y + this.w / 2, this.w / 2, this.w / 2);
    }

    showVisited() {

        if (!this.visited) {
            return;
        }

        let x = this.i * this.w;
        let y = this.j * this.w;

        noStroke();
        fill(255, 0, 255, 50);
        rect(x, y, this.w, this.w);
    }

    showStack() {
        let x = this.i * this.w;
        let y = this.j * this.w;

        noStroke();
        fill(0, 255, 255, 100);
        rect(x, y, this.w, this.w);
    }

    show() {
        let x = this.i * this.w;
        let y = this.j * this.w;

        stroke(255, 255, 255, 100);

        if (this.walls[0]) {
            line(x, y, x + this.w, y);
        }

        if (this.walls[1]) {
            line(x + this.w, y, x + this.w, y + this.w);
        }

        if (this.walls[2]) {
            line(x + this.w, y + this.w, x, y + this.w);
        }

        if (this.walls[3]) {
            line(x, y + this.w, x, y);
        }

        if (this.visited) {
            noStroke();
            fill(255, 100, 255, 20);
            rect(x, y, this.w, this.w);
        }
    }

}

class Dijkstra {

    constructor(maze, start = null, end = null, col = null, row = null) {
        this.maze = maze;

        // Col and row
        this.col = col ? col : 15;
        this.row = row ? row : 15;

        if (start) {
            this.start = start;
        } else {
            this.start = maze[0][0];
        }

        if (end) {
            this.end = end;
        } else {
            this.end = maze[this.col - 1][this.row - 1];
        }

        // If end == start then set end to the last cell
        if (this.start === this.end) {
            this.end = maze[this.col - 1][this.row - 1];
        }

        this.start.showStart();
        this.end.showEnd();

        this.path = [];
        this.no_solution = false;

        // Stack
        this.stack = [];

        // Create paths variable that will store a list of possible paths
        this.paths = [];

        // Calculate the distance between each cell and the end cell
        this.calculateDistance();

        // Add the start to the stack
        this.stack.push(this.start);
    }

    removeElement(arr, elt) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === elt) {
                arr.splice(i, 1);
            }
        }
    }

    randomlyCloseWalls() {
        for (let i = 0; i < this.col; i++) {
            for (let j = 0; j < this.row; j++) {
                let probability_of_closing = 0.001;

                // Based on the number of col X row we can reduce this probability
                if (this.col * this.row > 100) {
                    probability_of_closing = 0.0001;
                }

                let cell = maze[i][j];

                let top = maze[i][j - 1];
                let right = maze[i + 1] ? maze[i + 1][j] : undefined;
                let bottom = maze[i][j + 1];
                let left = maze[i - 1] ? maze[i - 1][j] : undefined;

                if (top && random() < probability_of_closing) {
                    cell.walls[0] = true;
                    top.walls[2] = true;
                }

                if (right && random() <= probability_of_closing) {
                    cell.walls[1] = true;
                    right.walls[3] = true;
                }

                if (bottom && random() <= probability_of_closing) {
                    cell.walls[2] = true;
                    bottom.walls[0] = true;
                }

                if (left && random() < probability_of_closing) {
                    cell.walls[3] = true;
                    left.walls[1] = true;
                }

                // Replace the cell in the maze
                maze[i][j] = cell;
            }
        }
    }

    calculateDistance() {
        // For each cell in the maze calculate the distance between the current cell and the end cell
        for (let i = 0; i < this.col; i++) {
            for (let j = 0; j < this.row; j++) {
                let cell = maze[i][j];

                // Calculate the distance between the current cell and the end cell
                cell.h = dist(cell.i, cell.j, this.end.i, this.end.j);

                // Replace the cell in the maze
                maze[i][j] = cell;
            }
        }
    }


    getPath(current) {
        let path = [];

        // While the current cell has a previous cell
        while (current.previous) {
            // Add the current cell to the path
            path.push(current);

            // Set the current cell to the previous cell
            current = current.previous;
        }

        // Add the start to the path
        path.push(this.start);

        // Reverse the path
        path.reverse();

        return path;
    }

    solve() {
        // Use dijkstra's algorithm to find the shortest path between the start and end
        // https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm

        // While there are unvisited cells
        if (this.stack.length == 0) {
            // If there is no solution then stop the loop
            this.no_solution = true;
            noLoop();

            return;
        }
        // Get the current cell
        let current = this.stack.pop();

        // If the current cell is the end then stop
        if (current === this.end) {
            // Get the path
            this.path = this.getPath(current);

            // Stop the loop
            noLoop();

            return;
        }

        // Get the neighbors of the current cell
        let neighbors = current.getNeighbors(maze);

        // Add current to the path
        this.paths.push(current);

        // For each neighbor, calculate the distance between the neighbor and the end cell
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            // If the neighbor is not visited then add it to the stack
            if (neighbor.visited) {
                continue;
            }

            // If neighbor is in the stack then skip
            if (this.stack.includes(neighbor)) {
                continue;
            }

            // Update the score of the neighbor
            neighbor.f = current.f + neighbor.h;

            // Set the previous of the neighbor to the current cell
            neighbor.previous = current;

            // Show the visited cells
            neighbor.showVisited();

            // Show the current cell
            neighbor.highlight();
        }

        // Get the neighbor with the lowest score
        let lowest_score = Infinity;
        let lowest_score_index = -1;

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            // If the neighbor is already visited then skip
            if (neighbor.visited) {
                continue;
            }

            if (neighbor.f < lowest_score) {
                lowest_score = neighbor.f;
                lowest_score_index = i;
            }
        }

        // Insert the neighbor with the lowest score to the stack
        if (lowest_score_index !== -1) {
            this.stack.push(neighbors[lowest_score_index]);
        }

        // If index is -1 then go back to the previous cell
        if (lowest_score_index === -1) {

            while (current.previous) {
                // Set this score
                current.f = current.f + 10000;
                current.visited = true;

                // Get the previous cell
                let prev = current.previous;

                // If previous is start node then we have no solution
                if (!prev || prev === this.start) {
                    this.no_solution = true;
                    noLoop();

                    return;
                }

                // Get the neighbor with the lowest score
                // Loop over the prev and continually check the neighbors until
                // we find a neighbor that is not visited
                // If there is no neighbor then go back to the previous cell
                let neighbors = prev.getNeighbors(maze);

                // Get the neighbor with the lowest score
                let lowest_score = Infinity;
                let lowest_score_index = -1;

                for (let i = 0; i < neighbors.length; i++) {
                    let neighbor = neighbors[i];

                    // If the neighbor is already visited then skip
                    if (neighbor.visited) {
                        continue;
                    }

                    if (neighbor.f < lowest_score) {
                        lowest_score = neighbor.f;
                        lowest_score_index = i;
                    }
                }

                // If index is -1 then go back to the previous cell
                if (lowest_score_index === -1) {
                    current = prev;
                    continue;
                }

                prev.visited = true;
                this.stack.push(prev);

                return;
            }
        }

        // Set the current cell to visited
        current.visited = true;

        // If lowest_score_index is -1 then there is no solution
        if (lowest_score_index === -1) {
            console.log("No solution");
            this.no_solution = true;
            noLoop();

            return this.path;
        }

        // Get the path from the current cell
        let temp_path = [];

        // If there is a path
        while (current.previous) {
            temp_path.push(current.previous);
            current = current.previous;
        }

        // Draw the path
        for (let i = 0; i < temp_path.length; i++) {
            temp_path[i].showCurrentPath();
        }

        // Return the path
        return this.path;
    }

    reset() {
        this.path = [];
        this.paths = [];
        this.no_solution = false;

        // Add the start to the stack
        this.stack.push(this.start);

        // For each cell in the maze, reset
        for (let i = 0; i < this.col; i++) {
            for (let j = 0; j < this.row; j++) {
                maze[i][j].reset();
            }
        }

        // Calculate new scores
        this.calculateDistance();
    }

    showPath(possible = false) {
        // If there is no solution then set the color to red
        for (let i = 0; i < this.path.length; i++) {
            this.path[i].showPath(possible);
        }

        // If there is a path stop the loop
        if (this.path.length > 0) {
            noLoop();
        }
    }

    showStack() {

        for (let i = 0; i < this.paths.length; i++) {
            // If in path then skip
            if (this.path.includes(this.paths[i])) {
                continue;
            }

            // If in paths then highlight as open_ended
            this.paths[i].highlight(this.no_solution);
        }

        // If no solution then stop the loop
        if (this.no_solution) {
            noLoop();
        }
    }

    showPossiblePaths() {
        for (let i = 0; i < this.paths.length; i++) {
            // If path is in the path then skip
            if (this.path.includes(this.paths[i])) {
                continue;
            }

            this.paths[i].showPath(true);
        }
    }

    show() {
        // Draw the maze
        for (let i = 0; i < this.col; i++) {
            for (let j = 0; j < this.row; j++) {
                // Get the current cell
                let cell = maze[i][j];

                // Draw the cell
                cell.show();

                // Show the visited cells
                // cell.showVisited();
            }
        }

        // Show start and end
        this.start.showStart();
        this.end.showEnd();

        // Show the frontier
        this.showStack();

        // Show possible paths
        this.showPossiblePaths();

        // Show the path
        this.showPath();

        // For each cell in the maze, show the f,g,h values
        // for (let i = 0; i < this.col; i++) {
        //     for (let j = 0; j < this.row; j++) {
        //         let cell = maze[i][j];

        //         push();
        //         textSize(10);
        //         fill(255, 255, 255, 100);
        //         text(`f: ${cell.f}`, cell.i * cell.w + 5, cell.j * cell.w + 10);
        //         text(`g: ${cell.g}`, cell.i * cell.w + 5, cell.j * cell.w + 20);
        //         text(`h: ${cell.h}`, cell.i * cell.w + 5, cell.j * cell.w + 30);
        //         pop();
        //     }
        // }
    }

}