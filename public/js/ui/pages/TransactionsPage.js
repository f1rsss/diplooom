/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не передан');
    }

    this.element = element;
    this.lastOptions = null;
    this.registerEvents();
  }

  update() {
    this.render(this.lastOptions);
  }

  registerEvents() {
    const removeAccountBtn = document.querySelector('.remove-account');
    if (removeAccountBtn) {
      removeAccountBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.removeAccount();
      });
    }

    this.element.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('.transaction__remove');
      if (!removeBtn) return;

      event.preventDefault();
      const id = removeBtn.dataset.id;
      this.removeTransaction(id);
    });
  }

  removeAccount() {
    if (!this.lastOptions) return;

    const confirmed = confirm('Вы действительно хотите удалить счёт?');
    if (!confirmed) return;

    Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
      if (err || !response || !response.success) return;

      this.clear();
      App.updateWidgets();
      App.updateForms();
    });
  }

  removeTransaction(id) {
    const confirmed = confirm('Вы действительно хотите удалить эту транзакцию?');
    if (!confirmed) return;

    Transaction.remove({ id }, (err, response) => {
      if (err || !response || !response.success) return;

      App.update();
    });
  }

  render(options) {
    if (!options) return;
    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if (err || !response || !response.success) return;
      this.renderTitle(response.data);
    });

    Transaction.list({ account_id: options.account_id }, (err, response) => {
      if (err || !response || !response.success) return;
      this.renderTransactions(response.data);
    });
  }

  clear() {
    this.renderTransactions([]);
    this.renderTitle({ name: 'Название счёта' });
    this.lastOptions = null;
  }

  renderTitle(account) {
    const titleElement = document.querySelector('.content-title');
    titleElement.textContent = account.name;
  }

  formatDate(date) {
    const d = new Date(date);

    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
    ];

    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  getTransactionHTML(item) {
    const typeClass = item.type === 'income' ? 'transaction_income' : 'transaction_expense';
    const date = this.formatDate(item.created_at);

    return `
      <div class="transaction ${typeClass} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${date}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }

  renderTransactions(data) {
    const content = document.querySelector('.content');
    content.innerHTML = '';

    data.forEach((item) => {
      content.insertAdjacentHTML('beforeend', this.getTransactionHTML(item));
    });
  }
}