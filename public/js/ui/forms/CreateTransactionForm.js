/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, response) => {
      if (err || !response || !response.success) return;

      const select = this.element.querySelector('.accounts-select');
      if (!select) return;

      select.innerHTML = '';   // очищаем старые опции

      response.data.forEach((account) => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = account.name;
        select.appendChild(option);
      });
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
  console.log('1. onSubmit, data:', data);

  Transaction.create(data, (err, response) => {
    console.log('2. Ответ:', err, response);

    if (err || !response || !response.success) return;

    console.log('3.1 Перед close');
    const modalName = data.type === 'income' ? 'newIncome' : 'newExpense';
    App.getModal(modalName).close();

    console.log('3.2 Перед reset');
    this.element.reset();

    console.log('3.3 Перед update');
    App.update();

    console.log('3.4 Готово');
  });
}
}