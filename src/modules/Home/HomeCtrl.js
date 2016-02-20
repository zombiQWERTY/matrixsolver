export default class HomeController {
  constructor($scope) {
    this.$scope = $scope;
    $scope.$root.serviceType = 'default'; // Type of service panel (default[/edit/error])
    $scope.swapped = false; // Is marixes swapped?
    this.matrixSize = { // Min/max matrix size
      min: 2,
      max: 10
    };

    $scope.$root.matrix = { // Our matrixes
      active: 'A', // Set active matrix
      A: { // Matrix A - changeable by user
        line:  [1, 2, 3, 4], // Default number of lines
        cell:  [1, 2], // Default number of each line cells
        model: [''][''] // Empty model for current matrix
      },
      B: { // Matrix B - changeable by user
        line:  [1, 2],
        cell:  [1, 2, 3],
        model: ['']['']
      },
      C: { // Matrix C - non-changeable by user
        line:  [1, 2, 3, 4],
        cell:  [1, 2, 3],
        model: ['']['']
      }
    };

    $scope.$root.service = { // The functional of our service panel
      multiplyError: false, // Set error state (by default there is no errors)

      keyDown:       HomeController.keyDown, // Filter inputs
      swap:          this.swap.bind(this), // Swap our matrixes
      clear:         this.clear.bind(this), // Clear inputs
      change:        this.change.bind(this), // Set available range for input

      addLine:       this.toggleLine().add, // Adding new line
      removeLine:    this.toggleLine().remove, // Removing last line
      addCell:       this.toggleCell().add, // Adding new cell
      removeCell:    this.toggleCell().remove, // Removing last cell of each line

      multiply:      this.multiply.bind(this) // Multiple our matrixes
    };
  }

  clear() {
    this.$scope.$root.serviceType           = 'default'; // If non-default type set it to default
    this.$scope.$root.service.multiplyError = false; // If has an error, hide it

    const A = this.getModel('A');
    const B = this.getModel('B');
    const C = this.getModel('C');

    const rowsA = HomeController.getRowsLength(A);
    const colsA = HomeController.getColsLength(A);

    const rowsB = HomeController.getRowsLength(B);
    const colsB = HomeController.getColsLength(B);

    const rowsC = HomeController.getRowsLength(C);
    const colsC = HomeController.getColsLength(C);

    let   k, i; // Set iterators

    // Clear cells of each matrix
    for (k = 1; k <= rowsA; k++) {
      for (i = 1; i <= colsA; i++) {
        A[k][i] = '';
      }
    }

    for (k = 1; k <= rowsB; k++) {
      for (i = 1; i <= colsB; i++) {
        B[k][i] = '';
      }
    }

    for (k = 1; k <= rowsC; k++) {
      for (i = 1; i <= colsC; i++) {
        C[k][i] = '';
      }
    }

  }

  change(type, line, cell) {
    const model = this.getModel(type)[line][cell];

    // Our available range for input
    // There is only two checkings because onkeydown finished by now
    if (model < -10) {
      this.getModel(type)[line][cell] = -10;
    } else if (model > 10) {
      this.getModel(type)[line][cell] = 10;
    }
  }

  toggleLine() { // Add or remove lines
    const that = this;
    return {
      add() {
        that.addCellLine('line', 'A');
      },

      remove() {
        const model = that.getModel(that.getActiveMatrix);
        const line  = that.getMatrix(that.getActiveMatrix).line;
        if (line.length > that.matrixSize.min) {
          line.pop(); // Removing line

          for (let matrixLine in model) { // Delete last cell model of each line on line deleting
            if (model.hasOwnProperty(matrixLine)) {
              const keys = HomeController.getKeys(model);
              delete model[keys[keys.length - 1]];
              break; // Break loop after deleting
            }
          }


          if (that.getActiveMatrix === 'A') {
            const CModel = that.getModel('C');
            that.getMatrix('C').line.pop(); // Removing line in result matrix

            for (let matrixLine in CModel) {
              // Delete last cell model of result matrix lines on line deleting
              if (CModel.hasOwnProperty(matrixLine)) {
                const keys = HomeController.getKeys(CModel);
                delete CModel[keys[keys.length - 1]];
                break;
              }
            }
          }
        }
      }
    };
  }

  toggleCell() { // Add or remove cells
    const that = this;
    return {
      add() {
        that.addCellLine('cell', 'B');
      },

      remove() {
        const model = that.getModel(that.getActiveMatrix);
        const cell  = that.getMatrix(that.getActiveMatrix).cell;
        if (cell.length > that.matrixSize.min) {
          cell.pop();

          for (let matrixLine in model) {
            if (model.hasOwnProperty(matrixLine)) {
              for (let matrixCell in model[matrixLine]) {
                if (model[matrixLine].hasOwnProperty(matrixCell)) {
                  const keys = HomeController.getKeys(model[matrixLine]);
                  delete model[matrixLine][keys[keys.length - 1]];
                  break;
                }
              }
            }
          }

          if (that.getActiveMatrix === 'B') {
            const CModel = that.getModel('C');
            that.getMatrix('C').cell.pop();

            for (let matrixLine in CModel) {
              if (CModel.hasOwnProperty(matrixLine)) {
                for (let matrixCell in CModel[matrixLine]) {
                  if (CModel[matrixLine].hasOwnProperty(matrixCell)) {
                    const keys = HomeController.getKeys(CModel[matrixLine]);
                    delete CModel[matrixLine][keys[keys.length - 1]];
                    break;
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  addCellLine(type, whatMatrix) {
    const lineOrCell = this.getMatrix(this.getActiveMatrix)[type];
    const res        = this.getMatrix('C')[type];
    if (lineOrCell.length < this.matrixSize.max) { // Checking if matrix size is good for us
      lineOrCell.push(lineOrCell.length + 1); // Adding line or cell
      // Update result matrix for future multiplying (follow math matrix multiplying rules)
      if (this.getActiveMatrix === whatMatrix) {
        res.push(res.length + 1); // Adding line or cell into result matrix
      }
    }
  }

  multiply() {
    const A = this.getModel('A');
    const B = this.getModel('B');
    const C = this.getModel('C');

    const rowsA = HomeController.getRowsLength(A);
    const colsA = HomeController.getColsLength(A);

    const rowsB = HomeController.getRowsLength(B);
    const colsB = HomeController.getColsLength(B);

    let   k, i, j, res;

    const ifError = () => {
      this.$scope.$root.serviceType           = 'error';
      this.$scope.$root.service.multiplyError = true;
      return false;
    };

    if (!this.$scope.swapped) {
      if (colsA !== rowsB) { // If we can't multiple matrixes then throw error
        return ifError();
      }

      for (k = 1; k <= colsB; k++) { // Mathematical operations
        for (i = 1; i <= rowsA; i++) {
          C[i]    = C[i] || {1: 0, 2: 0, 3: 0}; // If line is empty then pass to them zeros
          C[i][k] = C[i][k] || 0; // If cell is empty then pass to them zero
          res = 0;
          for (j = 1; j <= rowsB; j++) {
            res += (A[i][j] || 0) * (B[j][k] || 0); // If cell of each matrix is empty then pass to them zero
          }
          C[i][k] = res; // Send result to models
        }
      }
    } else {
      if (colsB !== rowsA) {
        return ifError();
      }

      for (k = 1; k <= colsA; k++) {
        for (i = 1; i <= rowsB; i++) {
          C[i]    = C[i] || {1: 0, 2: 0, 3: 0};
          C[i][k] = C[i][k] || 0;
          res = 0;
          for (j = 1; j <= rowsA; j++) {
            res += (B[i][j] || 0) * (A[j][k] || 0);
          }
          C[i][k] = res;
        }
      }
    }
  }

  swap() {
    const $el = document.getElementsByClassName('matrix-named_to-swap'); // Get changeable matrixes...
    $el[0].parentNode.insertBefore($el[1].parentNode.removeChild($el[1]), $el[0]); // ...and swap it
    this.$scope.swapped = !this.$scope.swapped;
  }

  getMatrix(matrix = 'A') {
    return this.$scope.$root.matrix[matrix];
  }

  get getActiveMatrix() {
    return this.$scope.$root.matrix.active;
  }

  getModel(matrix = 'A') {
    return this.getMatrix(matrix).model;
  }

  static getRowsLength(matrix = {}) {
    return HomeController.getKeys(matrix).length;
  }

  static getColsLength(matrix = {}) {
    return HomeController.getKeys(matrix[1]).length;
  }

  static getKeys(object = {}) {
    return Object.keys(object);
  }

  static keyDown(event) {
    const allowed = [46, 8, 9, 27, 13, 110, 190, 189]; // Allow: backspace, delete, tab, escape, enter, minus and dot
    const isAllowed = allowed.includes(event.keyCode); // If key is allowed
    // Checking for meta keys
    if (isAllowed || (event.ctrlKey === true || event.metaKey === true) || event.keyCode >= 35 && event.keyCode <= 40) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }
}

HomeController.$inject = ['$scope'];
