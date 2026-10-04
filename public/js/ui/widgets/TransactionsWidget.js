/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */
class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемента не существует');
    }

    this.element = element;
    this.registerEvents();   // ← ДОБАВИТЬ ЭТУ СТРОКУ
  }

  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    // Кнопка «Новый доход»
    const incomeButton = this.element.querySelector('.create-income-button');
    if (incomeButton) {
      incomeButton.addEventListener('click', (event) => {
        event.preventDefault();
        App.getModal('newIncome').open();
      });
    }

    // Кнопка «Новый расход»
    const expenseButton = this.element.querySelector('.create-expense-button');
    if (expenseButton) {
      expenseButton.addEventListener('click', (event) => {
        event.preventDefault();
        App.getModal('newExpense').open();
      });
    }
  }
}