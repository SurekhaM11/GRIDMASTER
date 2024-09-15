document.addEventListener("DOMContentLoaded", function () {
  let height = 100;
  let score = 0;
  let firstSelectedCell = null;
  let secondSelectedCell = null;
  let rowCount = 0;
  let levelCount = 0;
  let isSelecting = false;
  const tableContainer = document.getElementById("container");
  const table = document.createElement("table");
  tableContainer.appendChild(table);

  createTableRows(3); // Create initial 3 rows
  //setInterval(removeEmptyRowsAndColumns, 5000);
  document.getElementById("level_id").addEventListener("click", levelIncrease);

  function createTableRows(rowNumber) {
    const min = 0;
    const max = 9;
    const colors = ["red", "rgb(100,100,187)"];
    for (let i = 0; i < rowNumber; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < 9; j++) {
        const td = document.createElement("td");
        const count = Math.floor(Math.random() * (max - min + 1) + min);
        td.textContent = count;
        if (j % 2 == 0) {
          td.style.backgroundColor = colors[0];
        } else {
          td.style.backgroundColor = colors[1];
        }

        td.dataset.rowIndex = i;
        td.addEventListener("click", function () {
          if (!isSelecting) {
            handleCellClick(td, j);
          }
        });

        tr.appendChild(td);
      }
      table.appendChild(tr);
      rowCount++;
    }
  }

  function handleCellClick(td, col) {
    const row = td.parentNode.rowIndex;

    if (!firstSelectedCell) {
      // First cell selection
      firstSelectedCell = {
        element: td,
        row: row,
        col: col,
        value: td.textContent,
      };
      td.style.backgroundColor = "lightblue";
    } else if (!secondSelectedCell) {
      // Second cell selection
      secondSelectedCell = {
        element: td,
        row: row,
        col: col,
        value: td.textContent,
      };
      td.style.backgroundColor = "lightgreen";

      if (shouldClearCells(firstSelectedCell, secondSelectedCell)) {
        // Check if adjacent
        if (areCellsAdjacent(firstSelectedCell, secondSelectedCell)) {
          score++;
          updateScore();

          isSelecting = true;
          setTimeout(() => {
            clearCell(firstSelectedCell, secondSelectedCell);
            resetSelection();
            isSelecting = false;
          }, 500);
        } else {
          // If not adjacent, reset selection
          setTimeout(resetSelection, 500);
        }
      } else {
        setTimeout(resetSelection, 500);
      }
    }
  }

  // Condition to clear cells: Either values match or sum to 10
  function shouldClearCells(cell1, cell2) {
    return (
      Number(cell1.value) === Number(cell2.value) ||
      Number(cell1.value) + Number(cell2.value) === 10
    );
  }

  // Check if two cells are adjacent (in the same row or column)

  function areCellsAdjacent(cell1, cell2) {
    const rowLength = 10;
    // console.log("first number row,col:", cell1.row, cell1.col);
    // console.log("second number row,col:", cell2.row, cell2.col);
    const sameRow =
      cell1.row === cell2.row && Math.abs(cell1.col - cell2.col) === 1;
    const sameColumn =
      cell1.col === cell2.col && Math.abs(cell1.row - cell2.row) === 1;
    const vertical =
      Math.abs(cell1.row - cell2.row) === 1 &&
      Math.abs(cell1.col - cell2.col) === 1;
    const rowWrapAround =
      cell1.row === cell2.row - 1 &&
      cell1.col === rowLength - 1 &&
      cell2.col === 0;

    const result = areCellsApartAndEmpty(cell1, cell2, table);
    const result1 = areCellsInConsecutiveRowsAndEmpty(cell1, cell2, table);
    return (
      sameRow || sameColumn || vertical || rowWrapAround || result || result1
    );
  }
  const areCellsApartAndEmpty = (cell1, cell2, table) => {
    const rowDistance = Math.abs(cell1.row - cell2.row);
    const colDistance = Math.abs(cell1.col - cell2.col);

    if (rowDistance === 0 && colDistance > 1) {
      // Check horizontally
      const minCol = Math.min(cell1.col, cell2.col);
      const maxCol = Math.max(cell1.col, cell2.col);
      for (let col = minCol + 1; col < maxCol; col++) {
        if (!isCellEmpty(cell1.row, col, table)) {
          return false;
        }
      }
      return true;
    } else if (colDistance === 0 && rowDistance > 1) {
      // Check vertically
      const minRow = Math.min(cell1.row, cell2.row);
      const maxRow = Math.max(cell1.row, cell2.row);
      for (let row = minRow + 1; row < maxRow; row++) {
        if (!isCellEmpty(row, cell1.col, table)) {
          return false;
        }
      }
      return true;
    } else if (rowDistance === colDistance && rowDistance > 1) {
      // Check diagonally
      const rowStep = (cell2.row - cell1.row) / rowDistance;
      const colStep = (cell2.col - cell1.col) / colDistance;
      let row = cell1.row + rowStep;
      let col = cell1.col + colStep;
      for (let i = 0; i < rowDistance - 1; i++) {
        if (!isCellEmpty(row, col, table)) {
          return false;
        }
        row += rowStep;
        col += colStep;
      }
      return true;
    }

    return false;
  };

  function isCellEmpty(row, col, table) {
    const middleCell = table.rows[row].cells[col];
    return middleCell.textContent === ""; // Returns true if the cell is empty
  }
  // Clear matched cells' content
  function clearCell(cell1, cell2) {
    cell1.element.textContent = "";
    cell2.element.textContent = "";
    cell1.element.style.backgroundColor = "";
    cell2.element.style.backgroundColor = "";
  }

  // Reset the selection of cells
  function resetSelection() {
    if (firstSelectedCell) firstSelectedCell.element.style.backgroundColor = "";
    if (secondSelectedCell)
      secondSelectedCell.element.style.backgroundColor = "";
    firstSelectedCell = null;
    secondSelectedCell = null;
  }

  // Update the score display
  function updateScore() {
    document.getElementById("score_value").innerText = `Score: ${score}`;
  }

  // Function to increase height and add new rows
  function levelIncrease() {
    const button = document.getElementById("level_id");
    height += 50;
    tableContainer.style.minHeight = height + "px";
    levelCount++;

    if (height > 300) {
      tableContainer.style.overflowY = "scroll";
    }

    if (levelCount === 5) {
      button.disabled = true;
      button.classList.remove("bg-primary");
      button.classList.add("bg-secondary");
    }

    createTableRows(1); // Add a new row each time level is increased
  }
  function areCellsInConsecutiveRowsAndEmpty(cell1, cell2, table) {
    // Check if cells are in consecutive rows
    const isConsecutiveRows = Math.abs(cell1.row - cell2.row) === 1;

    if (!isConsecutiveRows) {
      console.log("Not consecutive rows:", cell1.row, cell2.row);
      return false;
    }

    // Determine which is the first cell and which is the second based on column position
    const firstCell = cell1.row < cell2.row ? cell1 : cell2;
    const secondCell = cell1.row < cell2.row ? cell2 : cell1;

    // Get the number of columns (assuming all rows have the same number of columns)
    const numColumns = table.rows[0].cells.length;

    // Check if the first cell is in the same row as the second cell
    if (firstCell.row === secondCell.row) {
      // Check intermediate cells between them
      const minCol = Math.min(firstCell.col, secondCell.col);
      const maxCol = Math.max(firstCell.col, secondCell.col);
      for (let col = minCol + 1; col < maxCol; col++) {
        const middleCell = table.querySelector(
          `tr:nth-child(${firstCell.row + 1}) td:nth-child(${col + 1})`
        );
        if (
          middleCell &&
          middleCell.textContent.trim() !== "0" &&
          middleCell.textContent.trim() !== ""
        ) {
          console.log(
            "Non-empty cell found in the same row:",
            middleCell.textContent
          );
          return false;
        }
      }
    } else {
      // Check cells in the first row after the first cell
      for (let col = firstCell.col + 1; col < numColumns; col++) {
        const middleCell = table.querySelector(
          `tr:nth-child(${firstCell.row + 1}) td:nth-child(${col + 1})`
        );
        if (
          middleCell &&
          middleCell.textContent.trim() !== "0" &&
          middleCell.textContent.trim() !== ""
        ) {
          console.log(
            "Non-empty cell found in the first row:",
            middleCell.textContent
          );
          return false;
        }
      }

      // Check cells in the second row before the second cell
      for (let col = 0; col < secondCell.col; col++) {
        const middleCell = table.querySelector(
          `tr:nth-child(${secondCell.row + 1}) td:nth-child(${col + 1})`
        );
        if (
          middleCell &&
          middleCell.textContent.trim() !== "0" &&
          middleCell.textContent.trim() !== ""
        ) {
          console.log(
            "Non-empty cell found in the second row:",
            middleCell.textContent
          );
          return false;
        }
      }
    }

    console.log(
      "Cells are in consecutive rows and there are no elements in between."
    );
    return true;
  }
});
