/**
 * @module Root controller
 * @class MatrixController
 */
export default class MatrixController {
  /**
   * @constructor Operations with matrixes.
   */
  constructor($timeout, TitleService) {
    "ngInject";

    TitleService.setTitle({
      newTitle: 'Solve it easily'
    });

    this.$timeout    = $timeout;
    this.serviceType = 'default';  /** Type of service panel (default[/edit/error]) */
    this.swapped     = false;  /** Is marixes swapped? */
    this.matrixSize  = {  /** Min/max matrix size */
      min: 2,
      max: 10
    };

    this.matrix = {  /** Our matrixes */
      active: 'A', /** Set active matrix */
      A: {  /** Matrix A - changeable by user */
        line:  [1, 2, 3, 4], /** Default number of lines */
        cell:  [1, 2], /** Default number of each line cells */
        model: [''][''] /** Empty model for current matrix */
      },
      B: {  /** Matrix B - changeable by user */
        line:  [1, 2],
        cell:  [1, 2, 3],
        model: ['']['']
      },
      C: {  /** Matrix C - non-changeable by user */
        line:  [1, 2, 3, 4],
        cell:  [1, 2, 3],
        model: ['']['']
      }
    };

    this.service = {  /** The functional of our service panel */
      multiplyError: false, /** Set error state (by default there is no errors) */

      keyDown:       MatrixController.keyDown, /** Filter inputs */
      swap:          this.swap.bind(this), /** Swap our matrixes */
      clear:         this.clear.bind(this), /** Clear inputs */
      change:        this.change.bind(this), /** Set available range for input */

      addLine:       this.toggleLine().add, /** Adding new line */
      removeLine:    this.toggleLine().remove, /** Removing last line */
      addCell:       this.toggleCell().add, /** Adding new cell */
      removeCell:    this.toggleCell().remove, /** Removing last cell of each line */

      multiply:      this.multiply.bind(this) /** Multiple our matrixes */
    };

    this.changed = 0;
    this.empty   = 0;
  }

  clear() {
    this.serviceType           = 'default';  /** If non-default type set it to default */
    this.service.multiplyError = false;  /** If has an error, hide it */

    const A = this.getModel('A');
    const B = this.getModel('B');
    const C = this.getModel('C');

    const rowsA = MatrixController.getRowsLength(A);
    const colsA = MatrixController.getColsLength(A);

    const rowsB = MatrixController.getRowsLength(B);
    const colsB = MatrixController.getColsLength(B);

    const rowsC = MatrixController.getRowsLength(C);
    const colsC = MatrixController.getColsLength(C);

    let   k, i;  /** Set iterators */

    /** Clear cells of each matrix */
    for (k = 1; k <= rowsA; k++) {
      for (i = 1; i <= colsA; i++) { A[k][i] = ''; }
    }

    for (k = 1; k <= rowsB; k++) {
      for (i = 1; i <= colsB; i++) { B[k][i] = ''; }
    }

    for (k = 1; k <= rowsC; k++) {
      for (i = 1; i <= colsC; i++) { C[k][i] = ''; }
    }
  }

  change(type, line, cell) {
    const model      = this.getModel(type)[line][cell];
    this.serviceType = 'edit';  /** Set edit type for service panel on change */

    /** Our available range for input */
    /** There is only two checkings because onkeydown finished by now */
    if (model < -10) { this.getModel(type)[line][cell] = -10; }
    if (model > 10) { this.getModel(type)[line][cell] = 10; }

    /** Statements for service panel type controling */
    if (model !== '') { this.changed++; }
    if (model === '') { this.empty++; }

    if (this.changed && this.empty && this.changed === this.empty) {  /** Compare number of edited and empty inputs */
      this.serviceType = 'default';
      this.changed = 0;
      this.empty   = 0;
    }
  }

  toggleLine() {  /** Add or remove lines */
    const toggleLine = this;
    return {
      add() { toggleLine.addCellLine('line', 'A'); },

      remove() {
        const model = toggleLine.getModel(toggleLine.getActiveMatrix);
        const line  = toggleLine.getMatrix(toggleLine.getActiveMatrix).line;

        if (line.length <= toggleLine.matrixSize.min) { return; }

        line.pop();  /** Removing line */

        for (let matrixLine in model) {  /** Delete last cell model of each line on line deleting */
          if (!model.hasOwnProperty(matrixLine)) { continue; }

          const keys = MatrixController.getKeys(model);
          delete model[keys[keys.length - 1]];
          break;  /** Break loop after deleting */
        }

        if (toggleLine.getActiveMatrix !== 'A') { return; }

        const CModel = toggleLine.getModel('C');
        toggleLine.getMatrix('C').line.pop();  /** Removing line in result matrix */

        for (let matrixLine in CModel) {
          /** Delete last cell model of result matrix lines on line deleting */
          if (!CModel.hasOwnProperty(matrixLine)) { continue; }

          const keys = MatrixController.getKeys(CModel);
          delete CModel[keys[keys.length - 1]];
          break;
        }
      }
    };
  }

  toggleCell() {  /** Add or remove cells */
    const toggleCell = this;
    return {
      add() { toggleCell.addCellLine('cell', 'B'); },

      remove() {
        const model = toggleCell.getModel(toggleCell.getActiveMatrix);
        const cell  = toggleCell.getMatrix(toggleCell.getActiveMatrix).cell;

        if (cell.length <= toggleCell.matrixSize.min) { return; }

        cell.pop();

        for (let matrixLine in model) {
          if (!model.hasOwnProperty(matrixLine)) { continue; }

          for (let matrixCell in model[matrixLine]) {
            if (!model[matrixLine].hasOwnProperty(matrixCell)) { continue; }

            const keys = MatrixController.getKeys(model[matrixLine]);
            delete model[matrixLine][keys[keys.length - 1]];
            break;
          }
        }

        if (toggleCell.getActiveMatrix !== 'B') { return; }

        const CModel = toggleCell.getModel('C');
        toggleCell.getMatrix('C').cell.pop();

        for (let matrixLine in CModel) {
          if (!CModel.hasOwnProperty(matrixLine)) { continue; }

          for (let matrixCell in CModel[matrixLine]) {
            if (CModel[matrixLine].hasOwnProperty(matrixCell)) { continue; }

            const keys = MatrixController.getKeys(CModel[matrixLine]);
            delete CModel[matrixLine][keys[keys.length - 1]];
            break;
          }
        }
      }
    };
  }

  addCellLine(type, whatMatrix) {
    const lineOrCell = this.getMatrix(this.getActiveMatrix)[type];
    const res        = this.getMatrix('C')[type];
    if (lineOrCell.length >= this.matrixSize.max) { return; }  /** Checking if matrix size is good for us */

    lineOrCell.push(lineOrCell.length + 1);  /** Adding line or cell */
    /** Update result matrix for future multiplying (follow math matrix multiplying rules) */
    if (this.getActiveMatrix !== whatMatrix) { return; }

    res.push(res.length + 1);  /** Adding line or cell into result matrix */
  }

  multiply() {
    const A     = this.getModel('A');
    const B     = this.getModel('B');
    const C     = this.getModel('C');

    const rowsA = MatrixController.getRowsLength(A);
    const colsA = MatrixController.getColsLength(A);

    const rowsB = MatrixController.getRowsLength(B);
    const colsB = MatrixController.getColsLength(B);

    let   k, i, j, res;

    const ifError = () => {
      this.serviceType           = 'error';
      this.service.multiplyError = true;
      return false;
    };

    if (!this.swapped) {
      /** If we can't multiple matrixes then throw error */
      if (colsA !== rowsB) { return ifError(); }

      for (k = 1; k <= colsB; k++) {  /** Mathematical operations */
        for (i = 1; i <= rowsA; i++) {
          C[i]    = C[i] || {1: 0, 2: 0, 3: 0};  /** If line is empty then pass to them zeros */
          C[i][k] = C[i][k] || 0;  /** If cell is empty then pass to them zero */
          res = 0;
          /** If cell of each matrix is empty then pass to them zero */
          for (j = 1; j <= rowsB; j++) { res += (A[i][j] || 0) * (B[j][k] || 0); }
          C[i][k] = res;  /** Send result to models */
        }
      }
    }

    if (this.swapped) {
      if (colsB !== rowsA) { return ifError(); }

      for (k = 1; k <= colsA; k++) {
        for (i = 1; i <= rowsB; i++) {
          C[i]    = C[i] || {1: 0, 2: 0, 3: 0};
          C[i][k] = C[i][k] || 0;
          res = 0;
          for (j = 1; j <= rowsA; j++) { res += (B[i][j] || 0) * (A[j][k] || 0); }
          C[i][k] = res;
        }
      }
    }
  }

  swap() {
    const $el = document.getElementsByClassName('matrix-named_to-swap');  /** Get changeable matrixes... */
    $el[0].parentNode.insertBefore($el[1].parentNode.removeChild($el[1]), $el[0]);  /** ...and swap it */
    this.swapped = !this.swapped;
  }

  getMatrix(matrix = 'A') {
    return this.matrix[matrix];
  }

  get getActiveMatrix() {
    return this.matrix.active;
  }

  getModel(matrix = 'A') {
    return this.getMatrix(matrix).model;
  }

  static getRowsLength(matrix = {}) {
    return MatrixController.getKeys(matrix).length;
  }

  static getColsLength(matrix = {}) {
    return MatrixController.getKeys(matrix[1]).length;
  }

  static getKeys(object = {}) {
    return Object.keys(object);
  }

  static keyDown(event) {
    /** Allow: backspace, delete, tab, escape, enter, minus and dot */
    const allowed = [46, 8, 9, 27, 13, 110, 190, 189];
    const isAllowed = allowed.includes(event.keyCode);  /** If key is allowed */
    /** Checking for meta keys */
    if (isAllowed || (event.ctrlKey === true || event.metaKey === true) || event.keyCode >= 35 && event.keyCode <= 40) {
      return;
    }
    /** Ensure that it is a number and stop the keypress */
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }
}
