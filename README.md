# Dijkstra's algorithm

## Introduction

Dijkstra's algorithm is a pathfinding algorithm that finds the shortest path by calculating the shortest distance from the start node to all other nodes. The algorithm uses a priority queue to find the shortest path between two points.

## Installation

To run the simulation, simply clone the repository and open the `index.html` file in your browser. Alternatively, you can visit the [GitHub Pages](https://ghostscypher.github.io/dijkstra/src/index.html) for this repository.

## Explanation

### Algorithm

The algorithm is very simple. The algorithm starts by adding the start node to the priority queue. The algorithm then iterates over the priority queue until the priority queue is empty. In each iteration, the algorithm removes the node with the lowest distance from the priority queue. The algorithm then iterates over all the neighbors of the node and updates the distance of the neighbor if the distance is less than the current distance. The algorithm then adds the neighbor to the priority queue. The algorithm terminates when the priority queue is empty.

Incase we hit a wall we set the new distance to infinity. This ensures that the algorithm does not consider the wall as a valid path and we backtrack to the previous node. This will continue until we find a valid path or we find no solution. We define no solution when we backtrack to the start node and the priority queue is empty.

### Implementation

In my case instead of a priority the scores to the target are first calculated per grid basis. Then we create a stack that contains the start node. We then iterate over the stack until the stack is empty. In each iteration, we pop the node from the stack and then we iterate over all the neighbors of the node. We then calculate the score of the neighbor and if the score is less than the current score we update the score and add the neighbor to the stack. We then repeat this process until the stack is empty.

### Pseudocode

Taken from [Wikipedia](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)

```java
function Dijkstra(Graph, source):

    create vertex set Q

    for each vertex v in Graph:             // Initialization
        dist[v] ← INFINITY                  // Unknown distance from source to v
        prev[v] ← UNDEFINED                 // Previous node in optimal path from source
        add v to Q                          // All nodes initially in Q (unvisited nodes)

    dist[source] ← 0                        // Distance from source to source

    while Q is not empty:
        u ← vertex in Q with min dist[u]    // Node with the least distance
        remove u from Q

        for each neighbor v of u:           // where v is still in Q.
            alt ← dist[u] + length(u, v)
            if alt < dist[v]:               // A shorter path to v has been found
                dist[v] ← alt
                prev[v] ← u

    return dist[], prev[]
```

## Using the simulation

The simulation is very simple to use. The simulation will start automatically when the webpage is loaded.

1. The simulation can be reset by pressing the `r` key.
2. The simulation can be paused by pressing the `p` key.
3. When the simulation is paused, we enter into the select mode. In the select mode, we can select the start node, the end node. The start node is selected using the left mouse button. The end node is selected using the right mouse button.
4. The simulation can be resumed by pressing the `p` key. If we made any selection the simulation will start with the new selection. If we did not make any selection the simulation will resume with the previous selection.
5. To toggle the walls on or off, press the `w` key. Note that whenever the walls are toggled on or off, the simulation will be reset.

## Demo

<img src="https://raw.githubusercontent.com/ghostscypher/dijkstra/output/demo.gif" alt="Dijkstra's_search_algorithm">

## References

1. [Djikstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
2. [P5 JS](https://p5js.org/)
3. [P5 JS Reference](https://p5js.org/reference/)
4. [P5 JS Examples](https://p5js.org/examples/)
5. [P5 JS Web Editor](https://editor.p5js.org/)
6. [Coding train - P5 JS Tutorials](https://www.youtube.com/user/shiffman/playlists?view=50&sort=dd&shelf_id=14)
7. [The Nature of Code](https://natureofcode.com/)
8. [The Coding Train](https://thecodingtrain.com/)
9. [Geeks for Geeks - How to find Shortest Paths from Source to all Vertices using Dijkstra’s Algorithm](https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/)