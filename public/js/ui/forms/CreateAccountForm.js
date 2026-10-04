class CreateAccountForm extends AsyncForm {
  onSubmit(data) {
  console.log('1. onSubmit вызван, data:', data);   // ← добавьте

  Account.create(data, (err, response) => {
    console.log('2. Ответ сервера:', err, response); // ← добавьте

    if (err || !response || !response.success) return;

    App.getModal('createAccount').close();
    App.update();
    console.log('3. App.update() вызван');           // ← добавьте
  });
}
}