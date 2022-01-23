class User {
  // define a private field
  #name = "";
  constructor(name) {
    this.#name = name;
  }

  // define a private method
  #sayHello() {
    console.log(`Hello ${this.#name}`);
  }

  // define a public method
  displayMessage() {
    this.#sayHello();
  }
}

const user = new User("ridha");
user.displayMessage(); // Hello ridha
